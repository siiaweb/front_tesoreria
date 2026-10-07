import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment, } from '../../../environments/environment';
//import { Evo } from './Evo'

@Injectable({
  providedIn: 'root'
})
export class EvoService {

    public urlEndPoint = `${environment.rutaAPI}`;

  constructor( private http: HttpClient ) { }

  getEvo(entity:any) {
        return this.http.post(this.urlEndPoint + '/evo/order',entity)

  }

  retrieveInfo(referencia:string){
    return this.http.get(`${this.urlEndPoint}/evo/callback/${referencia}`)
  }

  insertarRespuesta(referencia : string,resultIndicator:string ){
     let params = new HttpParams();
        params = params.append('resultIndicator', resultIndicator);
      return this.http.post(`${this.urlEndPoint}/evo/trespbanco/${referencia}`,{}, {  params })
  }

}
