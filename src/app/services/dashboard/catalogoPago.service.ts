import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { CatalogoPago } from './catalogoPago';

@Injectable({
  providedIn: 'root'
})
export class CatalogoPagoService {

    public urlEndPoint = `${environment.rutaAPI}`;

  constructor( private http: HttpClient ) { }

  getCatalogoPago(tipoUser: string) {
    //return this.http.post<Usuarios>(this.urlEndPoint + '/tusuarios/'+login.user+'/'+login.password, login).pipe(
    //return this.http.post(this.urlEndPoint + '/evo/'+evo.session_id+'/'+evo.successIndicator, evo).pipe(
        return this.http.get(this.urlEndPoint + '/catalogoPago/'+tipoUser).pipe(
      map((response: any) => {
        return response;
        })
    );

  }

  getCatalogoPagoTipoUser(tipoUser: string) {
        return this.http.get(this.urlEndPoint + '/catalogoPagoTipoUser/'+tipoUser).pipe(
      map((response: any) => {
        return response;
        })
    );

  }

}