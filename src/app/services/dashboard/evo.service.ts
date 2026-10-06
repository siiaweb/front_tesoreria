import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  insertarRespuesta(referencia : string ){
      return this.http.post(`${this.urlEndPoint}/evo/trespbanco/${referencia}`,{})
  }

}
