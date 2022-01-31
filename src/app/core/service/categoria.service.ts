import { CatEmpresa } from './../../Data/models/categoria';
import { Injectable, PipeTransform } from '@angular/core';
import { HttpClient,  HttpHeaders,HttpEvent, HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import {debounceTime, delay, switchMap, tap, map, catchError} from 'rxjs/operators';
import {DecimalPipe} from '@angular/common';
import { Router } from '@angular/router';
import { Categoria } from '../../Data/models/categoria';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private router: Router, private http: HttpClient) { }

  getAllcategorias$(route:string) : Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.createCompleteRoute(route, environment.apiUrl), this.generateHeaders())
    .pipe(
      tap(categorias => console.log("Number of categorias: " + categorias.length)),
      catchError(this.handleError)
      );
  }

  getAllcatEmp$(route:string) : Observable<CatEmpresa[]> {
    return this.http.get<CatEmpresa[]>(this.createCompleteRoute(route, environment.apiUrl), this.generateHeaders())
    .pipe(
      tap(catEmpresas => console.log("Number of catEmpresas: " + catEmpresas.length)),
      catchError(this.handleError)
      );
  }

  public getClasificacionEmp = ():Observable<any> => this.http.get(this.createCompleteRoute('CEM_ClasificacionEmpresa',environment.apiUrl),this.generateHeaders());
  
  public getCiudades = ():Observable<any> => this.http.get(this.createCompleteRoute('CIU_Cuidades',environment.apiUrl),this.generateHeaders());//ciudades

  public getDepartamentos = ():Observable<any> => this.http.get(this.createCompleteRoute('DEP_Departamentos',environment.apiUrl),this.generateHeaders());//departamentos

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
