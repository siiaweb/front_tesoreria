import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getEvo(id: string, mount: number) {
    //return this.http.post<Usuarios>(this.urlEndPoint + '/tusuarios/'+login.user+'/'+login.password, login).pipe(
    //return this.http.post(this.urlEndPoint + '/evo/'+evo.session_id+'/'+evo.successIndicator, evo).pipe(
        return this.http.get(this.urlEndPoint + '/evo/'+id+'/'+mount).pipe(
      map((response: any) => {
        return response;
        })
    );

  }

}