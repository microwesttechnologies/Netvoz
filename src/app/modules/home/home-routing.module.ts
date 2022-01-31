import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { DetailComponent } from './page/detail/detail.component';


const routes: Routes = [

  {path: '',
  component: HomeComponent,},
  {
    path: 'detailOrder',
    component: DetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
