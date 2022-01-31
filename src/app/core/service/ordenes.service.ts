import { Injectable, PipeTransform } from '@angular/core';
import { HttpClient, HttpParams,  HttpHeaders,HttpEvent, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import {debounceTime, delay, switchMap, tap, map, catchError} from 'rxjs/operators';
import {DecimalPipe} from '@angular/common';
import { Router } from '@angular/router';
import { Orden } from '../../Data/models/orden';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  currentDate = new Date();
  date:string;
  constructor(private router: Router, private http: HttpClient, private datePipe: DatePipe) {
    this.date = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
   }

  getOrdenesFecha$(route:string, estado:string) : Observable<Orden[]> {

  /*   const params = new HttpParams()
    .set('fechaOrden', this.date)
    .set('idEstadoOrden', estado); */
    //let par = `?fechaOrden=${this.date}&idEstadoOrden=${estado}`
    console.log(this.createCompleteRoute(route, environment.apiUrl) + `?fechaOrden=${this.date}&idEstadoOrden=${estado}`);
    
    return this.http.get<Orden[]>(this.createCompleteRoute(route, environment.apiUrl) + `?fechaOrden=${this.date}&idEstadoOrden=${estado}`)
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

}
