import { Component,Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {DecimalPipe} from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/service/product.service';
import { Product } from '../../../Data/models/product';
import { Categoria } from '../../../Data/models/categoria';
import { Umedida } from '../../../Data/models/um';
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  @ViewChild('fileUploader',{static: false}) fileUploader: ElementRef<HTMLElement>;
  public image: string = '';

  title = 'Ver/Editar producto';
  form: FormGroup;
  id: number;
  producto: Product;
  categorias: Categoria;
  umedidas: Umedida;
  action: string;
  file;

  constructor(
    private dialogRef: MatDialogRef<ProductEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public repoService: ProductService,
    private snackBar:MatSnackBar,
    private ngxService: NgxUiLoaderService
    )
    {
      this.id = this.activatedRoute.snapshot.params.id;
      this.producto = data.producto;
      this.categorias = data.categorias;
      this.umedidas = data.umedidas;

    }
  ngOnInit(): void {
    this.buildForm();
  }

  createForm()
  {
    this.form = this.formBuilder.group({
      PRO_Codigo: [this.id, Validators.required],
      PRO_Nombre: [this.id, Validators.required],
      PRO_Descripcion: [''],
      CAT_CategoriasCAT_Nombre: ['', Validators.required],
      UME_UnidadesMedidaUME_Nombre: ['', Validators.required],
      PRO_PrecioUnidad: ['', Validators.required],
      PRO_Marca: ['', Validators.required],
  });
}

buildForm() {

    this.form = new FormGroup({
        PRO_Id : new FormControl(this.producto.PRO_Id,Validators.required),
        PRO_Codigo: new FormControl(this.producto.PRO_Codigo),
        PRO_Nombre: new FormControl(this.producto.PRO_Nombre, Validators.required),
        PRO_Descripcion: new FormControl(this.producto.PRO_Descripcion),
        PRO_PrecioUnidad: new FormControl(this.producto.PRO_PrecioUnidad, Validators.required),
        PRO_Estado : new FormControl(this.producto.PRO_Estado),
        CAT_Id : new FormControl(this.producto.CAT_Id),

        PRO_ImgProducto: new FormControl(this.producto.PRO_ImgProducto ? this.producto.PRO_ImgProducto : 'sin-imagen.png'),
        PRO_Marca: new FormControl(this.producto.PRO_Marca, Validators.required),
        UME_Id:new FormControl(this.producto.UME_Id),
        PRO_Tamano: new FormControl(this.producto.PRO_Tamano),
    });

    this.image = `https://netvoz.blob.core.windows.net/productos/${this.form?.get('PRO_ImgProducto').value}`;
}

close() {
  this.dialogRef.close(null);
}

async save() {
  if (this.form.valid) {
    if(this.file){
      this.ngxService.start();
      this.form.get('PRO_ImgProducto').setValue(this.file?.name);
      await this.saveImage();
    }
    this.ngxService.start();
    this.repoService.updateProduct$(this.form.value,'PRO_Productos/ActualizarProducto').subscribe(data=>{
      if(data){
        this.dialogRef.close(true);
        this.snackBar.open('Producto editado exitosamente',undefined,{
          panelClass:['bg-success'],
          duration: 2000
        });
      }else{
        this.snackBar.open('Error al editar producto',undefined,{
          panelClass:['bg-danger'],
          duration: 2000
        });
      }
      this.ngxService.stop();
    });
  }
}

saveImage = () => new Promise<void>(resolve=> this.repoService.uploadfile(environment.sasP,this.file,this.file?.name,'productos',()=>{
  this.ngxService.stop();
  resolve();
}))

onSelectCategoria(CAT_Id:number){
    this.form.patchValue({
    CAT_Id: CAT_Id
  });
  this.form.markAsDirty();
}

onSelectUmedida(UME_Id:number){
  this.form.patchValue({
    UME_Id: UME_Id
 });
 this.form.markAsDirty();
}

cargarImagen(){
  const fileElement: HTMLElement = this.fileUploader.nativeElement;
  fileElement.click();
}

selectFile(event: Event) {
  this.file      = (event.target as HTMLInputElement).files[0];
  if (this.file) {
    const reader  = new FileReader();
    reader.onload = () => {
      this.image  = reader.result as string;
    };
    console.log(this.file);
    reader.readAsDataURL(this.file);

  }

}

}
