import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, } from '../../../environments/environment';
import { map } from 'rxjs/operators';
//import { Evo } from './Evo'

@Injectable({
  providedIn: 'root'
})
export class EvoService {
// rutaAPI: 'http://localhost:8090/api',
    public urlEndPoint = `${environment.rutaAPI}`;

  constructor( private http: HttpClient ) { }

  getEvo(amount: number,entity:any) {
        return this.http.post(this.urlEndPoint + '/evo/'+amount,entity)

  }

  retrieveInfo(referencia:string){
    return this.http.get(`${this.urlEndPoint}/evo/callback/${referencia}`)
  }

  insertarRespuesta(referencia : string ){
      return this.http.post(`${this.urlEndPoint}/trespbanco/${referencia}`,null)
  }

}
