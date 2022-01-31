import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AuthGuard } from './core/guard/auth.guard';
import { SidebarComponent } from './layout/sidebar/sidebar.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: SidebarComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path:'dashboard',
        loadChildren: ()=> import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path:'about',
        loadChildren:() => import('./modules/about/about.module').then(m => m.AboutModule)
      },
      {
        path:'contact',
        loadChildren:() => import('./modules/contact/contact.module').then(m => m.ContactModule)
      },
      {
        path:'products',
        loadChildren:() => import('./modules/products/products.module').then(m => m.ProductsModule)
      },
      {
      path:'bussines',
      loadChildren:() => import('./modules/bussines/bussines.module').then(m => m.BussinesModule)
    }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
