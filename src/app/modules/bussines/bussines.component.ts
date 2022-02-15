import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  HostListener,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { MatSnackBar } from "@angular/material/snack-bar";
import { NgxUiLoaderService } from "ngx-ui-loader";

import { environment } from "../../../environments/environment";

import { CategoriaService } from "src/app/core/service/categoria.service";
import { ProductService } from "src/app/core/service/product.service";
import { AuthService } from "src/app/core/service/auth.service";

import AOS from "aos";

export interface Color {
  name: string;
}

@Component({
  selector: "app-bussines",
  templateUrl: "./bussines.component.html",
  styleUrls: ["./bussines.component.scss"],
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
  public image = "";

  bussinesForm: FormGroup;
  disabledSubmitButton = true;
  optionsSelect: Array<any>;
  asuntoControl = new FormControl("01");

  file;

  public clasificaciones = [];
  public ciudadesFilter = [];
  public departamentos = [];
  public ciudades = [];

  @HostListener("input") oninput() {
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
    private api: AuthService
  ) {}

  ngOnInit(): void {
    AOS.init();

    this.bussinesForm = this.formBuilder.group({
      EMP_Nit: ["", [Validators.required]],
      EMP_Nombre: ["", [Validators.required]],
      EMP_Direccion: ["", [Validators.required]],
      CEM_Id: ["", [Validators.required]],
      CIU_Id: ["", [Validators.required]],
      DEP_Id: ["", [Validators.required]],
      EMP_Imagen: ["", [Validators.required]],
      EMP_Estado: [true],
      EMP_FechaUltimaActualizacion: ["2021-07-04T22:19:36.4041122-05:00"],
      EMP_PorcentajeComision: [0],
      EMP_Banco: ["", [Validators.required]],
      EMP_TipoCuenta: ["", [Validators.required]],
      EMP_NumeroCuenta: ["", [Validators.required]],
      EMP_TitularCuenta: ["", [Validators.required]],
      EMP_Email: ["", [Validators.required]],
      EMP_Color: ["", [Validators.required]],
      EMP_Instagram: [""],
      EMP_Facebook: [""],
      EMP_Whatsapp: [""],
    });

    this.getClasificacionEmp();
    this.getDepartamentos();
    this.getCiudades();

    this.bussinesForm.get("DEP_Id").valueChanges.subscribe((id) => {
      console.log(this.bussinesForm.get("DEP_Id").value,id);
      
      if (!this.bussinesForm.get("DEP_Id").value && id) {
        this.getCiudadesByDepartamento(id);
        this.bussinesForm.get("DEP_Id").setValue(id);
      }
      this.bussinesForm.get("CIU_Id").setValue("");
    });
  }

  getClasificacionEmp = () =>
    this.categoriaService
      .getClasificacionEmp()
      .subscribe((response) => (this.clasificaciones = response));

  getDepartamentos = () =>
    this.categoriaService
      .getDepartamentos()
      .subscribe((response) => (this.departamentos = response));

  getCiudades = () =>
    this.categoriaService
      .getCiudades()
      .subscribe((response) => (this.ciudades = response));

  getCiudadesByDepartamento = (id) =>
    (this.ciudadesFilter = this.ciudades.filter(
      (ciudad) => +ciudad.DEP_Id === +id
    ));

  cargarImagen() {
    const fileElement: HTMLElement = this.fileUploader.nativeElement;
    fileElement.click();
  }

  log = () => {
    console.log('Entra');
  }

  selectFile(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string;
      };
      reader.readAsDataURL(this.file);
      this.bussinesForm.get("EMP_Imagen").setValue(this.file?.name);
    } else {
      this.bussinesForm.get("EMP_Imagen").setValue("");
    }
  }

  save() {
    if (this.bussinesForm.valid) {
      this.ngxService.start();
      this.apiImage.uploadfile(
        environment.sasE,
        this.file,
        `Empresa_${this.replaceAll(
          this.bussinesForm.get("EMP_Nombre").value,
          " ",
          "_"
        )}`,
        "empresas",
        () => {
          this.bussinesForm
            .get("EMP_Imagen")
            .setValue(
              `Empresa_${this.replaceAll(
                this.bussinesForm.get("EMP_Nombre").value,
                " ",
                "_"
              )}`
            );
          this.api.postBussines(this.bussinesForm.value).subscribe((data) => {
            this.ngxService.stop();
            this.snackBar.open("Empresa agregada exitosamente", undefined, {
              panelClass: ["bg-success"],
              duration: 2000,
            });
            this.bussinesForm.reset();
            this.bussinesForm.get("EMP_Estado").setValue(true);
            this.bussinesForm.get("EMP_PorcentajeComision").setValue(0);

          });
        }
      );
    }
  }

  escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string

  replaceAll = (str: string, find: any, replace: any) =>
    str.replace(new RegExp(this.escapeRegExp(find), "g"), replace);
}
