import { Injectable, PipeTransform } from '@angular/core';
import { HttpClient, HttpParams,  HttpHeaders,HttpEvent, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import {debounceTime, delay, switchMap, tap, map, catchError} from 'rxjs/operators';
import {DecimalPipe} from '@angular/common';
import { Router } from '@angular/router';
import { Orden } from '../../Data/models/orden';
import { environment } from '../../../environments/environment';
import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  private listMenu = [
    {
      text:'Pedidos Actuales',
      img: '../../../assets/images/iconV2/Actuales.png',
      url:'/home/dashboard/detailOrder'
    },{
      text:'Pedidos Aceptados',
      img: '../../../assets/images/iconV2/Aceptados.png',
      url:'/home/dashboard/detailOrder'
    },{
      text:'Pedidos Rechazados',
      img: '../../../assets/images/iconV2/Rechazados.png',
      url:'/home/dashboard/detailOrder'
    },{
      text:'Pedidos enviados',
      img: '../../../assets/images/iconV2/Enviados.png',
      url:'/home/dashboard/detailOrder'
    },{
      text:'Pedidos entregados',
      img: '../../../assets/images/iconV2/Entregado.png',
      url:'/home/dashboard/detailOrder'
    },
  ];

  public listMenuFilter = [];

  constructor(private router: Router, private http: HttpClient) {
   this.listMenuFilter = this.listMenu;
  }

  getOrdenesFecha$(route:string, fecha:string, estado:string) : Observable<Orden[]> {

    /*   const params = new HttpParams()
      .set('fechaOrden', this.date)
      .set('idEstadoOrden', estado); */
      //let par = `?fechaOrden=${this.date}&idEstadoOrden=${estado}`
      console.log(this.createCompleteRoute(route, environment.apiUrl) + `?fechaOrden=${fecha}&idEstadoOrden=${estado}`);

      return this.http.get<Orden[]>(this.createCompleteRoute(route, environment.apiUrl) + `?fechaOrden=${fecha}&idEstadoOrden=${estado}`)
      .pipe(
        tap(articles => console.log("Number of articles: " + articles.length)),
        catchError(this.handleError)
        );
    }

    private createCompleteRoute = (route: string, envAddress: string) => {

      return `${envAddress}${route}`;
    }

    private handleError(error: any) {
           return throwError(error);
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  public searchMenuItem = (item:string) => {
    if(item.length > 0 && item !== ""){
      this.listMenuFilter = this.listMenu.filter(elm=>elm.text.toLowerCase().indexOf(item.toLowerCase())>= 0);
    }else{
      this.listMenuFilter = this.listMenu;
    }
  }

}
