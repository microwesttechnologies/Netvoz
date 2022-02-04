import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NewBussine, NewUser, User } from '../../Data/models/user';
import { ResponsiveI } from '../../Data/models/responsive';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string;
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public newUser: Observable<NewUser>;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  newForm: Observable<any>;

  public infoUser: any;

  // helper methods
  private refreshTokenTimeout;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('userNetvoz'))
    );
    this.user = this.userSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.userSubject.value;
  }

  login(usuario: User) {
    const authData = {
      ...usuario,
      grant_type: 'password',
      client_id: 'NetVoz_Web',
    };
    const data = `grant_type=password&username=${authData.username}&password=${authData.password}&client_id=${authData.client_id}`;

    return this.http
      .post<any>(
        `${environment.apiUrl}token`,
        data /* ,  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }} */
      )
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes

          localStorage.setItem('userNetvoz', JSON.stringify(user));
          this.userSubject.next(user);
          this.startRefreshTokenTimer();
          return user;
        })
      );
  }

  getUser(): Observable<any> {
    return this.http
      .get<any>(
        'https://netvozapi.azurewebsites.net/api/v1/USU_Usuarios/GetUsuario'
      )
      .pipe(
        map((userinfo) => userinfo
        )
      );
  }

  saveInfoUser = (user) => window.localStorage.setItem('userinfo', JSON.stringify(user));

  getInfoUser = (user) => this.infoUser = user;

  postUser = (form: NewUser): Observable<ResponsiveI> =>
    this.http.post<ResponsiveI>(
      'https://netvozapi.azurewebsites.net/api/v1/USU_Usuarios/CrearUsuario/Netvoz',
      form,
      { headers: this.headers }
    )

  sendEmail = (params: any): Observable<any> => this.http.post(`${environment.apiUrl}/USU_Usuarios/EnviarCodigoVerificacionCorreo`, params, { headers: this.headers });

  postBussines = (form: NewBussine): Observable<ResponsiveI> => this.http.post<ResponsiveI>(`${environment.apiUrl}/EMP_Empresas`, form, { headers: this.headers });

  sendEmailRegister = (params: any): Observable<any> => this.http.post(`${environment.apiUrl}/USU_Usuarios/EnviarRegistroEmpresaCorreo`, params, { headers: this.headers });

  validateEmail = (params: any): Observable<any> => this.http.post(`${environment.apiUrl}/USU_Usuarios/ValidarCorreo/token`, params, { headers: this.headers });

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('userNetvoz');
    localStorage.removeItem('userinfo');
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken() {
    const authData = {
      grant_type: 'refresh_token',
      client_id: 'NetVoz_Web',
    };

    const refresh_token: string = JSON.parse(
      localStorage.getItem('userNetvoz')
    ).refresh_token;
    const data = `grant_type=${authData.grant_type}&refresh_token=${refresh_token}&client_id=${authData.client_id}`;
    return this.http.post<any>(`${environment.apiUrl}token`, data).pipe(
      map((user) => {
        localStorage.setItem('userNetvoz', JSON.stringify(user));
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      })
    );
  }

  private startRefreshTokenTimer() {
    const hoy = new Date();
    const milisegundos = hoy.getTime() + this.currentUserValue.expires_in * 1000; // getTime devuelve milisegundos de esa fecha
    const fevence = new Date(milisegundos);
    const timeout = fevence.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  private handleError(error: any) {
    return throwError(error);
  }
}
