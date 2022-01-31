import { Injectable, PipeTransform } from '@angular/core';
import { HttpClient,  HttpHeaders,HttpEvent, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import {debounceTime, delay, switchMap, tap, map, catchError} from 'rxjs/operators';
import {DecimalPipe} from '@angular/common';
import { Router } from '@angular/router';
import { Umedida } from '../../Data/models/um';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UmedidaService {

  constructor(private router: Router, private http: HttpClient) { }

  getAllUm$(route:string) : Observable<Umedida[]> {
    return this.http.get<Umedida[]>(this.createCompleteRoute(route, environment.apiUrl), this.generateHeaders())
    .pipe(
      tap(ums => console.log("Number of um: " + ums.length)),
      catchError(this.handleError)
      );
  }

  private generateHeaders = () => {
    return {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userNetvoz')).access_token,
          })
    }
  }
  private createCompleteRoute = (route: string, envAddress: string) => {
         
    return `${envAddress}${route}`;
  }

  private handleError(error: any) {
         return throwError(error);
}

}
