import { ProductService } from "../../../core/service/product.service";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../core/service/auth.service";
import { environment } from "../../../../environments/environment";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Categoria } from "../../../Data/models/categoria";
import { ActivatedRoute } from "@angular/router";
import { Product } from "../../../Data/models/product";
import { Umedida } from "../../../Data/models/um";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

@Component({
  selector: "app-product-create",
  templateUrl: "./product-create.component.html",
  styleUrls: ["./product-create.component.scss"],
})
export class ProductCreateComponent implements OnInit {
  @ViewChild("fileUploader", { static: false })
  fileUploader: ElementRef<HTMLElement>;

  public title = "Crear producto";
  public form: FormGroup;
  public id: number;
  public producto: Product;
  public categorias: Categoria;
  public umedidas: Umedida;
  public action: string;
  public file;

  public imageProductos = [];
  public colorProductos = [];
  private nombreEmpresa = "";

  constructor(
    private dialogRef: MatDialogRef<ProductCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private api: ProductService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private ngxService: NgxUiLoaderService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.categorias = data.categorias;
    this.umedidas = data.umedidas;
  }

  ngOnInit() {
    this.nombreEmpresa =
      this.authService.infoUser.USU_EmpresasUsuarios[0].Nombre;
    const idEmpresa = this.authService.infoUser.USU_EmpresasUsuarios[0].Codigo;

    this.form = this.formBuilder.group({
      PRO_Codigo: ["", [Validators.required]],
      PRO_Nombre: ["", [Validators.required]],
      PRO_Descripcion: ["", [Validators.required]],
      PRO_PrecioUnidad: ["", [Validators.required]],
      EMP_Id: [idEmpresa, [Validators.required]],
      PRO_FechaUltimaActualizacion: ["2021-07-04T22:19:36.4041122-05:00"],
      PRO_Estado: true,
      CAT_Id: ["", [Validators.required]],
      PRO_EsProducto: true,
      PRO_ImgProducto: ["", [Validators.required]],
      PRO_Marca: ["", [Validators.required]],
      UME_Id: ["", [Validators.required]],
      PRO_Tamano: ["", [Validators.required]],
      PRO_Eliminado: false,
      PRO_DescripcionDetallada: [""],
      IPR_ImagenesProducto: new FormArray([]),
      DPR_DetalleProducto: new FormArray([]),
    });
  }

  addColor = (value) =>
    this.colorProductos.push({
      DPR_Color: value,
    });

  removeColor = (index: number) => this.colorProductos.splice(index, 1);

  onSelectCategoria(CAT_Id: number) {
    this.form.patchValue({
      CAT_Id,
    });
  }

  onSelectUmedida(UME_Id: number) {
    this.form.patchValue({
      UME_Id,
    });
  }

  cargarImagen() {
    const fileElement: HTMLElement = this.fileUploader.nativeElement;
    fileElement.click();
  }

  selectFile(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
    if (this.file) {
      const reader = new FileReader();

      this.imageProductos.push({
        IPR_EsImagenPrincipal: this.imageProductos.length === 0 ? true : false,
        ext: this.file.name.split('.')[this.file.name.split('.').length - 1],
        PRO_ProductosPRO_Nombre: "",
        IPR_RutaImagen: "",
        file: this.file,
        imagenUrl: "",
      });

      reader.onload = () =>
        (this.imageProductos[this.imageProductos.length - 1].imagenUrl =
          reader.result as string);

      reader.readAsDataURL(this.file);

      if (this.imageProductos.length === 1) {
        this.form.get("PRO_ImgProducto").setValue(this.file?.name);
      }
    }
  }

  removeImageProduct = (index: number) => this.imageProductos.splice(index, 1);

  uploadfile = () =>
    new Promise<void>((resolve) => {
      this.imageProductos.forEach(async (elm) => {
        await this.api.uploadfile(
          environment.sasP,
          elm.file,
          elm.IPR_RutaImagen,
          "productos",
          () => resolve()
        );
      });
    });

  async save() {
    if (this.form.valid) {
      this.ngxService.start();

      this.colorProductos.forEach((elm) =>
        (this.form.get("DPR_DetalleProducto") as FormArray).push(
          this.formBuilder.group({
            DPR_Color: elm.DPR_Color,
            DPR_Estado: true,
          })
        )
      );

      this.imageProductos.forEach((elm,index) =>{
        elm.IPR_RutaImagen = `${this.replaceAll(this.nombreEmpresa,' ','_')}_${this.replaceAll(this.form.get('PRO_Nombre').value,' ','_')}_${index+1}.${elm.ext}`;
        (this.form.get("IPR_ImagenesProducto") as FormArray).push(
          this.formBuilder.group({
            PRO_ProductosPRO_Nombre: this.form.get('PRO_Nombre').value,
            IPR_EsImagenPrincipal: elm.IPR_EsImagenPrincipal,
            IPR_RutaImagen: elm.IPR_RutaImagen,
            IPR_Estado: true
          })
        );
        if(index === 0){
          this.form.get("PRO_ImgProducto").setValue(elm.IPR_RutaImagen);
        }
      }
      );

      await this.uploadfile();

      this.api.createProduct(this.form.value).subscribe((data) => {
        this.ngxService.stop();
        this.dialogRef.close(true);
        this.snackBar.open("Producto agregado exitosamente", undefined, {
          panelClass: ["bg-success"],
          duration: 2000,
        });
      });

    }
  }

  close() {
    this.dialogRef.close(null);
  }

  escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

  replaceAll = (str: string, find: any, replace: any) => str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);

}
