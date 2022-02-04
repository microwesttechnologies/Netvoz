import { ProductService } from "../../../core/service/product.service";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../core/service/auth.service";
import { AlertService } from "src/app/core/service/alert.service";
import { environment } from "../../../../environments/environment";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Categoria } from "../../../Data/models/categoria";
import { ActivatedRoute } from "@angular/router";
import { Product } from "../../../Data/models/product";
import { Umedida } from "../../../Data/models/um";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

export interface Color {
  name: string;
}

@Component({
  selector: "app-product-create",
  templateUrl: "./product-create.component.html",
  styleUrls: ["./product-create.component.scss"],
})
export class ProductCreateComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  colors: Color[] = [];

  @ViewChild('fileUploader', { static: false })
  fileUploader: ElementRef<HTMLElement>;
  public image = '';

  title = 'Crear producto';
  form: FormGroup;
  id: number;
  producto: Product;
  categorias: Categoria;
  umedidas: Umedida;
  action: string;
  file;

  public imageProductos = [];
  public colorProductos = [];

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
    const idEmpresa = this.authService.infoUser.USU_EmpresasUsuarios[0].Codigo;
    
    this.form = this.formBuilder.group({
      PRO_Codigo: ['', [Validators.required]],
      PRO_Nombre: ['', [Validators.required]],
      PRO_Descripcion: ['', [Validators.required]],
      PRO_PrecioUnidad: ['', [Validators.required]],
      EMP_Id: [idEmpresa, [Validators.required]],
      PRO_FechaUltimaActualizacion: ['2021-07-04T22:19:36.4041122-05:00'],
      PRO_Estado: true,
      CAT_Id: ['', [Validators.required]],
      PRO_EsProducto: true,
      PRO_ImgProducto: ['', [Validators.required]],
      PRO_Marca: ['', [Validators.required]],
      UME_Id: ['', [Validators.required]],
      PRO_Tamano: ['', [Validators.required]],
      PRO_Eliminado: true,
      PRO_DescripcionDetallada: [''],
      IPR_ImagenesProducto: [[]],
      DPR_DetalleProducto: this.formBuilder.group({}),
    });
  }

  addColor = (value) => 
    this.colorProductos.push({
      DPR_Color:value,
      DPR_Estado:true
    })

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
  
  close() {
    this.dialogRef.close(null);
  }

  save() {
    if (this.form.valid) {
      this.ngxService.start();

      this.api.uploadfile(
        environment.sasP,
        this.file,
        this.file.name,
        'productos',
        () => {
          this.api.createProduct(this.form.value).subscribe((data) => {
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
        IPR_EsImagenPrincipal:this.imageProductos.length === 0 ? true : false,
        PRO_ProductosPRO_Nombre:'',
        IPR_RutaImagen:'',
        IPR_Estado:true,
        file:this.file,
        imagenUrl:'',
      });

      reader.onload = () => this.imageProductos[this.imageProductos.length -1].imagenUrl = reader.result as string;

      reader.readAsDataURL(this.file);
    }
  }

  removeProduct = (index:number) => this.imageProductos.splice(index,1);
}
