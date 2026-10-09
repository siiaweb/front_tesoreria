import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../environments/environment';
import { map } from 'rxjs/operators';
//import { Evo } from './Evo'

@Injectable({
  providedIn: 'root'
})
export class EvoService {

    public urlEndPoint = `${environment.rutaAPI}`;

  constructor( private http: HttpClient ) { }

  getEvo(amount: number,entity:any) {

    return this.http.post(`${this.urlEndPoint}/evo/${amount}`,entity);
        //return this.http.get(this.urlEndPoint + '/evo/'+referencia+'/'+mount,entity);
  }
  
  retrieveInfo(referencia:string){
    return this.http.get(`${this.urlEndPoint}/evo/callback/${referencia}`)
  }

  insertarRespuesta(referencia : string,resultIndicator:string ){
     let params = new HttpParams();
        params = params.append('resultIndicator', resultIndicator);
      return this.http.post(`${this.urlEndPoint}/evo/trespbanco/${referencia}`,{}, {  params })
  }

insertarRespuestaConPdf(
  referencia: string,
  resultIndicator: string
): Observable<HttpResponse<ArrayBuffer>> {
  const params = new HttpParams()
    .set('resultIndicator', resultIndicator);

  const httpOptions: {
    params: HttpParams;
    responseType: 'arraybuffer';
    observe: 'response';
  } = {
    params,
    responseType: 'arraybuffer',
    observe: 'response'
  };

  return this.http.post(
    `${this.urlEndPoint}/evo/respuesta/${referencia}`,
    {},
    httpOptions
  );
}
  
}
/*
  getPDF(referencia: string): Observable<any> {
    return this.http.get(
      `${this.urlEndPoint}/pdf/${encodeURIComponent(referencia)}`,
      {
    
    responseType: 'blob'
  }
    );
    */