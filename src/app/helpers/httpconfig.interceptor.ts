import { Injectable } from '@angular/core';
import {  HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent,HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AlertService } from '../core/service/alert.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url != 'https://netvozapi.azurewebsites.net/api/v1/token'){
             const token: string = JSON.parse(localStorage.getItem('userNetvoz'))?.access_token;// localStorage.getItem('token');
             if (token) {
                request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
              }
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/x-www-form-urlencoded') });
           }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    //console.log('event--->>>', event);
                }
                return event;
            }));
    }
}

