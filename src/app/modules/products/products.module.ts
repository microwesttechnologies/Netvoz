import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgbPaginationModule, NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import { ProductsRoutingModule } from "./products-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgxUiLoaderModule } from "ngx-ui-loader";


//////import components
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductEditComponent } from "./product-edit/product-edit.component";
import { ProductsExcelimportComponent } from "./products-excelimport/products-excelimport.component";
import { CategoriaSelectComponent } from "./categoria-select/categoria-select.component";
import { UmedidaSelectComponent } from "./umedida-select/umedida-select.component";
import { ProductCreateComponent } from "./product-create/product-create.component";
import {  MatChipsModule } from '@angular/material/chips';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductEditComponent,
    ProductsExcelimportComponent,
    CategoriaSelectComponent,
    UmedidaSelectComponent,
    ProductCreateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProductsRoutingModule,
    NgbPaginationModule,
    NgbAlertModule,
    SharedModule,
    MatSnackBarModule,
    NgxUiLoaderModule,
    MatChipsModule,
    ColorPickerModule,
  ],
  providers: [],
  bootstrap: [ProductCreateComponent, ProductEditComponent]
})
export class ProductsModule {}
