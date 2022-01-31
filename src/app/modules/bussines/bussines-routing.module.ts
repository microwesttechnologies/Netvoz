import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BussinesComponent } from '../bussines/bussines.component';

const routes: Routes = [
  { path: '',
    children: [
      { path: '',  component: BussinesComponent },
      { path: '/create',  component: BussinesComponent },
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BussinesRoutingModule {}
