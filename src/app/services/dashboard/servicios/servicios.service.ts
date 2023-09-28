import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Tservicios } from './tservicios';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

    public urlEndPoint = `${environment.rutaAPI}`;

    constructor( private http: HttpClient ) { }

    getServicios() {
        return this.http.get(this.urlEndPoint + '/tservicios/').pipe(
        map((response: any) => {
            return response;
            })
        );
    }

    getServicio(id) {
        return this.http.get(this.urlEndPoint + '/tservicios/'+id).pipe(
        map((response: any) => {
            return response;
            })
        );
    }

    create(servicios: Tservicios): Observable<Tservicios> {
        //console.log(servicios);
        return this.http.post<Tservicios>(`${environment.rutaAPI + '/tservicios'}`, servicios).pipe(
          map((response: any) => {
            //console.log(response);
            return response;
            })
        );
        
    }
    
    update(id: number, servicios: Tservicios): Observable<Tservicios> { 
        //console.log(servicios);
        return this.http.put<Tservicios>(`${environment.rutaAPI + '/tservicios/'+id}`,servicios).pipe(
          map((response: any) => {
            //console.log(response);
            return response;
            })
        );
    }
    
    delete(id: number): Observable<Tservicios> { 
        return this.http.delete<Tservicios>(`${environment.rutaAPI + '/tservicios/'+id}`).pipe(
          map((response: any) => {
            //console.log(response);
            return response;
            })
        );
    }

}