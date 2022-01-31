import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavComponent } from './layout/nav/nav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { HttpConfigInterceptor } from './helpers/httpconfig.interceptor';
import { appInitializer } from './helpers/app.initializer';
import { AuthService } from './core/service/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ColorPickerModule } from 'ngx-color-picker';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    FooterComponent,
    NavComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    NgbModule,
    BrowserAnimationsModule,
    SharedModule,
    MatSidenavModule,
    MatListModule,
    HttpClientModule,
    ColorPickerModule,
    MatChipsModule,
  ],
  exports: [
  ],
  providers: [
    DatePipe,
    //  { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService] },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // provider used to create fake backend
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
