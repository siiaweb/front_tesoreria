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


  constructor(private http: HttpClient) { }
  getRecibosPagosOnline(usuario: string) {
    return this.http.get(`${this.urlEndPoint}/recibos/${usuario}`)
      .pipe(
        map((response: any) => response
        )
      );
  }
  getPDF(referencia: string): Observable<Blob> {
    return this.http.get(
      `${this.urlEndPoint}/pdf/${encodeURIComponent(referencia)}`,
      { responseType: 'blob' }
    );
  }
  getTsqpagosonline() {
    return this.http.get(this.urlEndPoint + '/tsqpagosonline/', { responseType: 'text' });
  }

  getRecibos() {
    return this.http.get(this.urlEndPoint + '/tpagosonline/' + sessionStorage.getItem('usuID')).pipe(
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

  getCartaNoAdeudo(foliopago: string, ref: string): Observable<any> {
    return this.http.get<any>(`${environment.rutaAPI}/cartaNA?foliopago=${foliopago}&ref=${ref}&forma=L`, { responseType: 'blob' as 'json' });
  }

}