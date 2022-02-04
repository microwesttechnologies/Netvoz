import { Injectable, PipeTransform } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import {
  tap,
  map,
  catchError,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { Product } from '../../Data/models/product';
import { environment } from '../../../environments/environment';
import { ResponsiveI } from '../../Data/models/responsive';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // private _loading$ = new BehaviorSubject<boolean>(true);
  // private _search$ = new Subject<void>();
  // private _products$ = new BehaviorSubject<Product[]>([]);
  // private _total$ = new BehaviorSubject<number>(0);
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  private products: Product[];
  private products$ = new Subject<Product[]>();

  private account = 'netvoz';

  // public product: Observable<Product>;
  constructor(private router: Router, private http: HttpClient) { }

  // Fetch all articles
  getAllProducts$(route: string): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.createCompleteRoute(route, environment.apiUrl))
      .pipe(
        tap((articles) =>
          console.log('Number of articles: ' + articles.length)
        ),
        catchError(this.handleError)
      );
  }

  // Fetch product by cod
  getProductByCode$(route: string): Observable<Product> {
    return this.http
      .get<Product>(this.createCompleteRoute(route, environment.apiUrl))
      .pipe(
        tap((product) =>
          console.log(product.PRO_Codigo + ' ' + product.PRO_Nombre)
        ),
        catchError(this.handleError)
      );
  }
  // Create article
  createProduct = (form: Product): Observable<ResponsiveI> =>
    this.http.post<ResponsiveI>(
      'https://netvozapi.azurewebsites.net/api/v1/PRO_Productos',
      form,
      { headers: this.headers }
    )

  // Update product
  updateProduct$(product: Product, route: string): Observable<Product> {
    return this.http
      .post<Product>(
        this.createCompleteRoute(route, environment.apiUrl),
        product,
        this.generateHeaders()
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateStateProduct$(route: string, producto: any): Observable<any> {
    return this.http
      .post<any>(
        this.createCompleteRoute(route, environment.apiUrl),
        producto,
        this.generateHeaders()
      )
      .pipe(
        map((res) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteProductByCod = (code: string | number): Observable<any> =>
    this.http
      .delete<any>(
        `${environment.apiUrl}PRO_Productos/${code}`,
        this.generateHeaders()
      )
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      )

  public upload(data, route): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('userNetvoz')).access_token,
    });
    return this.http
      .post<any>(this.createCompleteRoute(route, environment.apiUrl), data, {
        headers,
        reportProgress: true,
        responseType: 'json',
        observe: 'events',
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError(this.errorMgmt)
      );
  }

  public async listImages(): Promise<string[]> {
    const result: string[] = [];

    const blobs = this.containerClient().listBlobsFlat();
    for await (const blob of blobs) {
      result.push(blob.name);
    }
    return result;
  }

  private containerClient = (sas?: string, container?: string): ContainerClient => {

    let token = '';
    if (sas) {
      token = sas;
    }

    return new BlobServiceClient(
      `https://${this.account}.blob.core.windows.net?${token}`
    ).getContainerClient(container);
  }

  public uploadfile = (sas: string, file: Blob, name: string, container: string, handler: () => void) => {
    const blockBlobCliente = this.containerClient(sas, container).getBlockBlobClient(name);
    blockBlobCliente.uploadData(file, { blobHTTPHeaders: { blobContentType: file.type } }).then(() => handler());
  }

  UploadJson(data: JSON, route: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers };

    return this.http.post(
      this.createCompleteRoute(route, environment.apiUrl),
      data,
      httpOptions
    );
  }

  UploadExcel(formData: FormData, route: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers };

    return this.http.post(
      this.createCompleteRoute(route, environment.apiUrl),
      formData,
      httpOptions
    );
  }

  showProductsLoad(route: string): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.createCompleteRoute(route, environment.apiUrl))
      .pipe(
        tap((produtsLoad) =>
          console.log('Numero productos cargados: ' + produtsLoad.length)
        ),
        catchError(this.handleError)
      );
  }

  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' +
          JSON.parse(localStorage.getItem('userNetvoz')).access_token,
      }),
    };
  }

  private createCompleteRoute = (route: string, envAddress: string) => `${envAddress}${route}`;

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
}
