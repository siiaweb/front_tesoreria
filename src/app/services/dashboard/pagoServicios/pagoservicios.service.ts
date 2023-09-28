import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { TpagosOnline } from '../pagoServicios/tpagosonline';
import { TdpagosOnline } from '../pagoServicios/tdpagosonline';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PagoServiciosService {

    public urlEndPoint = `${environment.rutaAPI}`;

    getHeadersPOST(): HttpHeaders {
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json'
      });
      return headers;
    }

  constructor( private http: HttpClient ) { }

  getTsqpagosonline() {
        return this.http.get(this.urlEndPoint + '/tsqpagosonline/').pipe(
      map((response: any) => {
        return response;
        })
    );

  }

  getRecibos() {
    //return this.http.post<Usuarios>(this.urlEndPoint + '/tusuarios/'+login.user+'/'+login.password, login).pipe(
    //return this.http.post(this.urlEndPoint + '/evo/'+evo.session_id+'/'+evo.successIndicator, evo).pipe(
        return this.http.get(this.urlEndPoint + '/tpagosonline/'+sessionStorage.getItem('usuID')).pipe(
      map((response: any) => {
        return response;
        })
    );

  }

  printReceipt(id, ref_banco): any {
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    
    return this.http.get<any>(this.urlEndPoint + '/print/' + id + '/' + ref_banco, httpOptions);
  }

  printReceiptDsto(id, ref_banco): any {
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
      // 'responseType'  : 'blob' as 'json'        //This also worked
    };
    
    return this.http.get<any>(this.urlEndPoint + '/printDesc/' + id + '/' + ref_banco, httpOptions);
  }

  create(pagoOnline: TpagosOnline): Observable<TpagosOnline> {
    //console.log(pagoOnline);
    
    return this.http.post<TpagosOnline>(`${environment.rutaAPI + '/tpagosonline'}`, pagoOnline).pipe(
      map((response: any) => {
        //console.log(response);
        return response;
        })
    );
  }

  createDetalle(folio:string,det: String[]): Observable<TpagosOnline> {
    //const user = sessionStorage.Login;
    //console.log(folio);
    //console.log(det);
    return this.http.post<String>(`${environment.rutaAPI + '/tdpagosonline?folio='+folio+'&det='+det}`, det).pipe(
      map((response: any) => {
        //console.log(response);
        return response;
        })
    );
  }


  
  updateMaster(id: String): Observable<TpagosOnline> {
    return this.http.put<TpagosOnline>(`${environment.rutaAPI + '/tpagosonline/{id}'}`+id,TpagosOnline).pipe(
      map((response: any) => {
        //console.log(response);
        return response;
        })
    );
  }

  createDetail(detail: any, dpago_folpago: string) {
    console.log(detail);
    const headers = new HttpHeaders({
      'Content-Type' : 'application/json'
    });
    const body = JSON.stringify(detail);
    return this.http.post(`${environment.rutaAPI + '/tdpagosonline'}`,body, {headers}).pipe(
    //return this.http.get<TpagosOnline[]>(`${environment.rutaAPI + '/tdpagosonline/'}`+detail).pipe(
      map((response: any) => {
        console.log(response);
        return response;
        })
    );
  }

}