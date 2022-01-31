import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './page/home/home.component';
import { SharedModule } from '../../shared/shared.module';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { FigurecardComponent } from '../../shared/figurecard/figurecard.component';
import { ImagecardComponent } from '../../shared/imagecard/imagecard.component';
import { DetailComponent } from './page/detail/detail.component';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';



@NgModule({
  declarations: [HomeComponent, FigurecardComponent, ImagecardComponent, DetailComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    SharedModule,
  ]
})
export class HomeModule { }
