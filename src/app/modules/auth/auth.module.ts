import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';

//////////////////////importamos componentes////////////////
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { HeaderComponent } from '../../shared/header/header.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    HeaderComponent,

  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AuthRoutingModule,
    HttpClientModule,
    SharedModule
  ]
})
export class AuthModule { }
