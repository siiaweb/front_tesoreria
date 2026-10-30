import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogoPagoService {

  public urlEndPoint = `${environment.rutaAPI}`;

  constructor(private http: HttpClient) { }

  getCatalogoPago(tipoUser: string) {
    return this.http.get(this.urlEndPoint + '/catalogoPago/' + tipoUser).pipe(
      map((response: any) => {
        return response;
      })
    );

  }

  getCatalogoPagoTipoUser(tipoUser: string) {
    return this.http.get(this.urlEndPoint + '/conceptos/catalogoPagoTipoUser/' + tipoUser).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

}