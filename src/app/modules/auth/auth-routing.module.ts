import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path:'',
    children:[
      {
        path:'login',
        component: LoginComponent
      },
      {
        path:'home',
        component: SidebarComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
