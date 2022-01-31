import { Component, OnInit } from '@angular/core';
import { Orden } from '../../../../Data/models/orden';
import { OrdenService } from '../../../../core/service/orden.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DetailComponent } from '../detail/detail.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import AOS from 'aos';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ordenes: Orden[];
  ord_pend:number;
  ord_acep:number;
  ord_desp:number;
  ord_fact:number;
  ord_rech:number;
  ord_entr:number;
  mySubscription: any;

  currentDate = new Date();
  date:string;

  constructor(
    public repoServiceOrden: OrdenService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
    )
  {}

  ngOnInit(): void {
    this.getOrdenes();
    AOS.init();
  }

  getOrdenes() {

		this.repoServiceOrden.getOrdenesFecha$(`ORD_Ordenes/GetOrdenesFechaEstado`, this.date, '0' )
			.subscribe(
				data => {
          this.ordenes = data
          console.log(this.ordenes);
          this.ord_pend = this.ordenes.length;
          this.ord_acep = this.ordenes.filter(orden => orden.EOR_Id === 2).length;
          this.ord_desp = this.ordenes.filter(orden => orden.EOR_Id === 4).length;
          this.ord_rech = this.ordenes.filter(orden => orden.EOR_Id === 5).length;
          this.ord_entr = this.ordenes.filter(orden => orden.EOR_Id === 6).length;

        },
				errorCode => {


        });
  }
  onClick(){

  }

  Detail_pend(event){
    this.router.navigate(['/dashboard/detailOrder'], {state: {data: this.ordenes, titulo: 'Pedidos'}});
  }

  Detail_acept(event){
    this.router.navigate(['/dashboard/detailOrder'], {state: {data: this.ordenes.filter(orden => orden.EOR_Id === 2), titulo: 'Pedidos Aceptados'}});
  }

  Detail_desp(event){
    this.router.navigate(['/dashboard/detailOrder'], {state: {data: this.ordenes.filter(orden => orden.EOR_Id === 4) , titulo: 'Pedidos Despachados'}});
  }
  Detail_recha(event){
    this.router.navigate(['/dashboard/detailOrder'], {state: {data: this.ordenes.filter(orden => orden.EOR_Id === 5), titulo: 'Pedidos Rechazados'}});
  }

  Detail_entre(event){
    this.router.navigate(['/dashboard/detailOrder'], {state: {data: this.ordenes.filter(orden => orden.EOR_Id === 6), titulo: 'Pedidos Entregados'}});
  }
}
