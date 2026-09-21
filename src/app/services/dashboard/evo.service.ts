import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
        return this.http.post(this.urlEndPoint + '/evo/'+amount,entity)
       
  }

}