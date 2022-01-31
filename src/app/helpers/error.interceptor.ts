import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../core/service/auth.service';
import { AlertService } from '../core/service/alert.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
      private authenticationService: AuthService,
      private alertService:AlertService,
      private router:Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        return next.handle(request).pipe(catchError(err => {


          /*   if (err.statusText ==='Unknown Error')
            {
                const error = 'No hay conexion a la red' || err.statusText;
                return throwError(error);
            }
            if (err.status === 400)
            {
                let error: string;
                if (err.error.error === 'invalid_grant')
                {
                    error = 'Usuario o contraseña invalidos' || err.statusText;
                }
                else
                {
                    error = err.status || err.statusText;
                }
                return throwError(error);
            }

            const error = err.status || err.statusText;
            console.log('intercepeta el error');

            console.log(err);

            return throwError(error);

 */         let data = {};
            let errorMessage = '';
            if (err.error instanceof ErrorEvent) {
              // client-side error
              data = {
                message:`Error: ${err.error.message}`,
                status: err.status
                };
                errorMessage = `Error: ${err.error.message}`;
            } else {
              // server-side error
              data = {
                message:`Error: ${err.error.message}`,
                status: err.status
                };
                if (err.error.error === 'invalid_grant')
                {
                  errorMessage = `Usuario o contraseña invalidos`;
                  this.alertService.opensweetalert('error', 'Autenticación', errorMessage)
                  return throwError(errorMessage);
                }

              errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
            }
            if (err.status === 401) {
              errorMessage = `Lo sentimos, su sesión ha expirado, por favor vuelve a iniciar sesión.`;
            }

            Swal.fire({
              icon: err.status === 401 ? 'info' : 'error',
              title: err.status === 401 ? 'Sesión expirada' : 'Error',
              text: errorMessage,
            }).then(response=>{
              if(response.isConfirmed && err.status === 401){
                this.router.navigate(['/auth/login']);
              }
            });

            //this.alertService.opensweetalert('info', 'Sesión expirada', errorMessage)
            return throwError(errorMessage);

        }))
    }
}
