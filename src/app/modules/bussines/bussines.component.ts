import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HostListener } from '@angular/core';
import { AlertService } from "src/app/core/service/alert.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { AuthService } from "src/app/core/service/auth.service";
import { AotSummaryResolver } from '@angular/compiler';
import { environment } from "../../../environments/environment";
import AOS from 'aos';
import { ProductService } from 'src/app/core/service/product.service';

export interface Color {
  name: string;
}

@Component({
  selector: 'app-bussines',
  templateUrl: './bussines.component.html',
  styleUrls: ['./bussines.component.scss']
})
export class BussinesComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  imageRes = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  colors: Color[] = [];

  @ViewChild("fileUploader", { static: false })
  fileUploader: ElementRef<HTMLElement>;
  public image: string = "";

  bussinesForm: FormGroup;
  disabledSubmitButton: boolean = true;
  optionsSelect: Array<any>;
  asuntoControl = new FormControl('01');

  color: string = "#ffffff";
  file;

  @HostListener('input') oninput() {
    if (this.bussinesForm.valid) {
      this.disabledSubmitButton = false;
    }
  }

  constructor(
    private dialogRef: MatDialogRef<BussinesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private ngxService: NgxUiLoaderService,
    private api: AuthService,
    private apiImage: ProductService,
    private fb: FormBuilder) {


    this.bussinesForm = this.fb.group({

    });
  }

  // funcion crear color en el input color nuevo
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Agragar o escribir en el input
    if ((value || '').trim()) {
      this.colors.push({ name: value.trim() });
    }

    //Reseteo valor input
    if (input) {
      input.value = '';
    }
  }

  //funcion eliminar color en el input color nuevo
  remove(color: Color): void {
    const index = this.colors.indexOf(color);

    if (index >= 0) {
      this.colors.splice(index, 1);
    }
  }

  cargarImagen() {
    const fileElement: HTMLElement = this.fileUploader.nativeElement;
    fileElement.click();
    this.imageRes = true;
  }

  selectFile(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      };
      reader.readAsDataURL(this.file);
      this.bussinesForm.get("PRO_ImgProducto").setValue(this.file?.name);
    }
  }

  ngOnInit(): void {

    AOS.Init()
const idCEM = this.authService.casifBussines.CEM_Id[0].Codigo;
const idCIU = this.authService.cityBussines.CIU_Id[0].Codigo;

    this.bussinesForm = this.formBuilder.group
      ({
        EMP_Nit: ["", [Validators.required]],
        EMP_Nombre: ["", [Validators.required]],
        EMP_Direccion: ["", [Validators.required]],
        CEM_Id: [idCEM, [Validators.required]],
        CIU_Id: [idCIU, [Validators.required]],
        EMP_Imagen: ["", [Validators.required]],
        EMP_Estado: [true, [Validators.required]],
        EMP_FechaUltimaActualizacion: ["2021-07-04T22:19:36.4041122-05:00"],
        EMP_PorcentajeComision: [0, [Validators.required]],
        EMP_Banco: ["", [Validators.required]],
        EMP_TipoCuenta: ["", [Validators.required]],
        EMP_NumeroCuenta: ["", [Validators.required]],
        EMP_TitularCuenta: ["", [Validators.required]],
        EMP_Email: ["", [Validators.required]],
        EMP_Color: ["", [Validators.required]],
        EMP_Instagram: ["", [Validators.required]],
        EMP_Facebook: ["", [Validators.required]],
        EMP_Whatsapp: ["", [Validators.required]],
      })
  }

  save() {
    if (this.bussinesForm.valid) {
      this.ngxService.start();
      this.apiImage.uploadfile(
        environment.sasP,
        this.file,
        this.file.name,
        "productos",
        () => {
          this.api.postBussines(this.bussinesForm.value).subscribe((data) => {
            this.ngxService.stop();
            this.dialogRef.close(true);
            this.snackBar.open("Producto agregado exitosamente", undefined, {
              panelClass: ["bg-success"],
              duration: 2000,
            });
          });
        }
      );
    }
  }

}