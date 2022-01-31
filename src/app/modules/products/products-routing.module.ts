import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductsExcelimportComponent } from './products-excelimport/products-excelimport.component';

const routes: Routes = [
  { path: '',
    children: [
      { path: '', component: ProductListComponent },
      { path: ':id/edit',  component: ProductEditComponent },
      { path: '/create',  component: ProductEditComponent },
      { path: 'importExcel',  component: ProductsExcelimportComponent },

  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
