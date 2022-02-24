import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../../core/service/product.service";
import { Product } from "../../../Data/models/product";
import { Categoria } from "../../../Data/models/categoria";
import { Umedida } from "../../../Data/models/um";
import { environment } from "../../../../environments/environment";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { AuthService } from "src/app/core/service/auth.service";

@Component({
  selector: "app-product-edit",
  templateUrl: "./product-edit.component.html",
  styleUrls: ["./product-edit.component.scss"],
})
export class ProductEditComponent implements OnInit {
  @ViewChild("fileUploader", { static: false })
  fileUploader: ElementRef<HTMLElement>;
  public image: string = "";

  public title = "Ver/Editar producto";
  public form: FormGroup;
  public id: number;
  public producto: Product;
  public categorias: Categoria;
  public umedidas: Umedida;
  public action: string;
  public file;

  public imageProductosEliminados = [];
  public colorProductosEliminados = [];
  public imageProductos = [];
  public colorProductos = [];

  private nombreEmpresa = "";

  constructor(
    private dialogRef: MatDialogRef<ProductEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public repoService: ProductService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private ngxService: NgxUiLoaderService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.producto = data.producto;
    this.categorias = data.categorias;
    this.umedidas = data.umedidas;
  }
  ngOnInit(): void {
    this.nombreEmpresa =
      this.authService.infoUser.USU_EmpresasUsuarios[0].Nombre;
    this.buildForm();
  }

  buildForm() {
    this.form = new FormGroup({
      PRO_Id: new FormControl(this.producto.PRO_Id, Validators.required),
      PRO_Codigo: new FormControl(this.producto.PRO_Codigo),
      PRO_Nombre: new FormControl(
        this.producto.PRO_Nombre,
        Validators.required
      ),
      PRO_Descripcion: new FormControl(this.producto.PRO_Descripcion),
      PRO_PrecioUnidad: new FormControl(
        this.producto.PRO_PrecioUnidad,
        Validators.required
      ),
      PRO_Estado: new FormControl(this.producto.PRO_Estado),
      CAT_Id: new FormControl(this.producto.CAT_Id),

      PRO_ImgProducto: new FormControl(
        this.producto.PRO_ImgProducto
          ? this.producto.PRO_ImgProducto
          : "sin-imagen.png"
      ),
      PRO_Marca: new FormControl(this.producto.PRO_Marca, Validators.required),
      UME_Id: new FormControl(this.producto.UME_Id),
      PRO_Tamano: new FormControl(this.producto.PRO_Tamano),
      PRO_DescripcionDetallada: new FormControl(
        this.producto.PRO_DescripcionDetallada
      ),
      IPR_ImagenesProducto: new FormArray([]),
      DPR_DetalleProducto: new FormArray([]),
    });

    this.producto.DPR_DetalleProducto.forEach((color: any) =>
      this.colorProductos.push({
        DPR_Estado: color.DPR_Estado,
        DPR_Color: color.DPR_Color,
        DPR_Id: color.DPR_Id,
        PRO_Id: color.PRO_Id,
        $id: color.$id,
      })
    );

    this.producto.IPR_ImagenesProducto.forEach((imagen: any) =>
      this.imageProductos.push({
        imagenUrl: `https://netvoz.blob.core.windows.net/productos/${imagen.IPR_RutaImagen}`,
        IPR_EsImagenPrincipal: imagen.IPR_EsImagenPrincipal,
        PRO_ProductosPRO_Nombre: imagen.PRO_ProductosPRO_Nombre,
        IPR_RutaImagen: imagen.IPR_RutaImagen,
        IPR_Estado: imagen.IPR_Estado,
        IPR_Id: imagen.IPR_Id,
        PRO_Id: imagen.PRO_Id,
        $id: imagen.$id,
      })
    );
  }

  addColor = (value) =>
    this.colorProductos.push({
      PRO_Id: this.producto.PRO_Id,
      DPR_Color: value,
      DPR_Estado: true,
    });

  removeColor = (index: number) => {
    if (this.colorProductos[index]?.DPR_Id) {
      this.colorProductosEliminados.push(this.colorProductos[index].DPR_Id);
    }
    this.colorProductos.splice(index, 1);
  };

  onSelectCategoria(CAT_Id: number) {
    this.form.patchValue({
      CAT_Id: CAT_Id,
    });
    this.form.markAsDirty();
  }

  onSelectUmedida(UME_Id: number) {
    this.form.patchValue({
      UME_Id: UME_Id,
    });
    this.form.markAsDirty();
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
        PRO_ProductosPRO_Nombre: `${this.nombreEmpresa}`,
        PRO_Id: this.producto.PRO_Id,
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

  removeImageProduct = (index: number) => {
    if (this.imageProductos[index]?.IPR_Id) {
      this.imageProductosEliminados.push(this.imageProductos[index]);
    }
    this.imageProductos.splice(index, 1);
  };

  uploadfile = () =>
    new Promise<void>((resolve) => {
      this.imageProductos.forEach(async (elm) => {
        if (elm?.file) {
          await this.repoService.uploadfile(
            environment.sasP,
            elm.file,
            elm.IPR_RutaImagen,
            "productos",
            () => resolve()
          );
        } else {
          resolve();
        }
      });
    });

    deleteFile = () => {
      new Promise<void>((resolve) => {
        this.imageProductosEliminados.forEach(async(elm)=>{
          const response = await this.repoService.deleteFile(environment.sasP,elm.IPR_RutaImagen,"productos");
          resolve();
        })
      })
    }

  async save() {
    if (this.form.valid && this.imageProductos.length > 0) {
      this.ngxService.start();

      this.colorProductos.forEach((elm) => {
        if (!elm?.DPR_Id) {
          this.repoService
            .addColorProducto(elm)
            .subscribe((response) => response);
        }
      });

      this.imageProductos.forEach((elm, index) => {
        elm.IPR_RutaImagen = `${this.replaceAll(
          this.nombreEmpresa,
          " ",
          "_"
        )}_${this.replaceAll(this.form.get("PRO_Nombre").value, " ", "_")}_${
          index + 1
        }.${elm.ext}`;
        
        elm.PRO_ProductosPRO_Nombre = this.form.get("PRO_Nombre").value;

        if (!elm?.IPR_Id) {
          this.repoService
            .addImagenProducto(elm)
            .subscribe((response) => response);
        }

        if(index === 0){
          this.form.get("PRO_ImgProducto").setValue(elm.IPR_RutaImagen);
        }
      });

      this.imageProductosEliminados.forEach((elm) => {
        this.repoService
          .deleteImagenProducto(elm.IPR_Id)
          .subscribe((response) => response);
      });

      this.colorProductosEliminados.forEach((idColor) => {
        this.repoService
          .deleteColorProducto(idColor)
          .subscribe((response) => response);
      });

      await this.uploadfile();
      //await this.deleteFile();

      this.repoService
        .updateProduct$(this.form.value, "PRO_Productos/ActualizarProducto")
        .subscribe((data) => {
          if (data) {
            this.colorProductosEliminados = [];
            this.imageProductosEliminados = [];
            this.dialogRef.close(true);
            this.snackBar.open("Producto editado exitosamente", undefined, {
              panelClass: ["bg-success"],
              duration: 2000,
            });
          } else {
            this.snackBar.open("Error al editar producto", undefined, {
              panelClass: ["bg-danger"],
              duration: 2000,
            });
          }
          this.ngxService.stop();
        });
    } else {
      this.snackBar.open(
        "Todos los campos son obligatorios y se necesita minimo una imagen",
        undefined,
        {
          panelClass: ["bg-danger"],
          duration: 2000,
        }
      );
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string

  replaceAll = (str: string, find: any, replace: any) =>
    str.replace(new RegExp(this.escapeRegExp(find), "g"), replace);
}
