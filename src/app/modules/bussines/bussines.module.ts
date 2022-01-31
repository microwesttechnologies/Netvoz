import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule, NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import { BussinesRoutingModule } from './bussines-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgxUiLoaderModule } from "ngx-ui-loader";

import { BussinesComponent } from '../bussines/bussines.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    BussinesComponent
  ],
  imports: [
    BussinesRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    FormsModule,
    NgbPaginationModule,
    NgbAlertModule,
    MatSnackBarModule,
    NgxUiLoaderModule,
    ColorPickerModule,
  ],
  providers: [],
  bootstrap: [BussinesComponent]
})
export class BussinesModule { }
