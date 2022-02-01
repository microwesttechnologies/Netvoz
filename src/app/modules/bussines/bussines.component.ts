import { Component, ElementRef, Inject, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { environment } from '../../../environments/environment';

import { CategoriaService } from 'src/app/core/service/categoria.service';
import { ProductService } from 'src/app/core/service/product.service';
import { AuthService } from 'src/app/core/service/auth.service';

import AOS from 'aos';

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

  @ViewChild('fileUploader', { static: false })
  fileUploader: ElementRef<HTMLElement>;
  public image = '';

  bussinesForm: FormGroup;
  disabledSubmitButton = true;
  optionsSelect: Array<any>;
  asuntoControl = new FormControl('01');

  color = '#ffffff';
  file;

  public ciudadesFilter = [];
  public departamentos = [];
  public ciudades = [];

  @HostListener('input') oninput() {
    if (this.bussinesForm.valid) {
      this.disabledSubmitButton = false;
    }
  }

  constructor(
    private dialogRef: MatDialogRef<BussinesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoriaService: CategoriaService,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiImage: ProductService,
    private snackBar: MatSnackBar,
    private api: AuthService) { }

  ngOnInit(): void {
    AOS.init();

    const idCEM = this.authService.casifBussines?.CEM_Id[0].Codigo;
    const idCIU = this.authService.cityBussines?.CIU_Id[0].Codigo;

    this.bussinesForm = this.formBuilder.group
      ({
        EMP_Nit: ['', [Validators.required]],
        EMP_Nombre: ['', [Validators.required]],
        EMP_Direccion: ['', [Validators.required]],
        CEM_Id: [idCEM, [Validators.required]],
        CIU_Id: [idCIU, [Validators.required]],
        DEP_Id: [idCIU, [Validators.required]],
        EMP_Imagen: ['', [Validators.required]],
        EMP_Estado: [true, [Validators.required]],
        EMP_FechaUltimaActualizacion: ['2021-07-04T22:19:36.4041122-05:00'],
        EMP_PorcentajeComision: [0, [Validators.required]],
        EMP_Banco: ['', [Validators.required]],
        EMP_TipoCuenta: ['', [Validators.required]],
        EMP_NumeroCuenta: ['', [Validators.required]],
        EMP_TitularCuenta: ['', [Validators.required]],
        EMP_Email: ['', [Validators.required]],
        EMP_Color: ['', [Validators.required]],
        EMP_Instagram: [''],
        EMP_Facebook: [''],
        EMP_Whatsapp: [''],
        DPR_Color: [''],
        PRO_ImgProducto: ['', [Validators.required]]
      });

    this.getDepartamentos();
    this.getCiudades();

    this.bussinesForm.get('DEP_Id').valueChanges.subscribe(id => this.getCiudadesByDepartamento(id));
  }

  getDepartamentos = () => this.categoriaService.getDepartamentos().subscribe(response => this.departamentos = response);

  getCiudades = () => this.categoriaService.getCiudades().subscribe(response => this.ciudades = response);

  getCiudadesByDepartamento = (id) => this.ciudadesFilter = this.ciudades.filter(ciudad => +ciudad.DEP_Id === +id);

  // funcion crear color en el input color nuevo
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Agragar o escribir en el input
    if ((value || '').trim()) {
      this.colors.push({ name: value.trim() });
    }

    // Reseteo valor input
    if (input) {
      input.value = '';
    }
  }

  // funcion eliminar color en el input color nuevo
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
      this.bussinesForm.get('PRO_ImgProducto').setValue(this.file?.name);
    }
  }

  save() {
    if (this.bussinesForm.valid) {
      this.ngxService.start();
      this.apiImage.uploadfile(
        environment.sasP,
        this.file,
        this.file.name,
        'productos',
        () => {
          this.api.postBussines(this.bussinesForm.value).subscribe((data) => {
            this.ngxService.stop();
            this.dialogRef.close(true);
            this.snackBar.open('Producto agregado exitosamente', undefined, {
              panelClass: ['bg-success'],
              duration: 2000,
            });
          });
        }
      );
    }
  }

}