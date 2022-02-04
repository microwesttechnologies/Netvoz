import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Orden } from '../../Data/models/orden';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  private listMenu = [
    {
      text: 'Pedidos Actuales',
      img: '../../../assets/images/iconV2/Actuales.png',
      url: '/home/dashboard/detailOrder'
    }, {
      text: 'Pedidos Aceptados',
      img: '../../../assets/images/iconV2/Aceptados.png',
      url: '/home/dashboard/detailOrder'
    }, {
      text: 'Pedidos Rechazados',
      img: '../../../assets/images/iconV2/Rechazados.png',
      url: '/home/dashboard/detailOrder'
    }, {
      text: 'Pedidos enviados',
      img: '../../../assets/images/iconV2/Enviados.png',
      url: '/home/dashboard/detailOrder'
    }, {
      text: 'Pedidos entregados',
      img: '../../../assets/images/iconV2/Entregado.png',
      url: '/home/dashboard/detailOrder'
    },
  ];

  public listMenuFilter = [];

  constructor(private http: HttpClient) {
    this.listMenuFilter = this.listMenu;
  }

  getOrdenesFecha$(route: string, fecha: string, estado: string): Observable<Orden[]> {

    return this.http.get<Orden[]>(this.createCompleteRoute(route, environment.apiUrl) + `?fechaOrden=${fecha}&idEstadoOrden=${estado}`)
      .pipe(
        tap(articles => console.log('Number of articles: ' + articles.length)),
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
    return throwError(errorMessage);
  }

  public searchMenuItem = (item: string) => {
    if (item.length > 0 && item !== '') {
      this.listMenuFilter = this.listMenu.filter(elm => elm.text.toLowerCase().indexOf(item.toLowerCase()) >= 0);
    } else {
      this.listMenuFilter = this.listMenu;
    }
  }

}
