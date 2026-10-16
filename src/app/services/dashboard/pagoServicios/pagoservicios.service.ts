import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoServiciosService {

  public urlEndPoint = `${environment.rutaAPI}`;
  constructor(private http: HttpClient) {

   }

  getRecibosPagosOnline(usuario: string) {
    return this.http.get(`${this.urlEndPoint}/pdf/recibos/${usuario}`)
  }

 

  getCartaNoAdeudo(foliopago: string, ref: string): Observable<any> {
    return this.http.get<any>(`${environment.rutaAPI}/pdf/cartaNA?foliopago=${foliopago}&ref=${ref}&forma=L`, { responseType: 'blob' as 'json' });
  }

  getRecibo(foliopago:number): Observable<HttpResponse<Blob>>{
    return this.http.get(
      `${this.urlEndPoint}/pdf/recibo/folio/${foliopago}`,{ observe: 'response',responseType: 'blob' }
    );
  }
  /*
  getPDF(referencia: string): Observable<any> {
    return this.http.get(
      `${this.urlEndPoint}/recibo/${encodeURIComponent(referencia)}`,{ observe: 'response',responseType: 'blob' }
    );

  }
*/
/*

  printReceipt(id, ref_banco): any {
    return this.http.get<any>(this.urlEndPoint + '/pdf/print/' + id + '/' + ref_banco, {
      responseType: 'arraybuffer' as 'json'
    });
  }

  printReceiptDsto(id, ref_banco): any {
    return this.http.get<any>(this.urlEndPoint + '/pdf/printDesc/' + id + '/' + ref_banco, {
      responseType: 'arraybuffer' as 'json'   //This also worked
    });
  }
*/



}