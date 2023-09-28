import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Tequipo } from './tequipo';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {

    public urlEndPoint = `${environment.rutaAPI}`;

    constructor( private http: HttpClient ) { }

    getEquipos() {
        return this.http.get(this.urlEndPoint + '/tequipo/').pipe(
        map((response: any) => {
            return response;
            })
        );
    }

    getEquipo(id) {
        return this.http.get(this.urlEndPoint + '/tequipo/'+id).pipe(
        map((response: any) => {
            return response;
            })
        );
    }

    create(equipo: Tequipo): Observable<Tequipo> {
        //console.log(equipo);
        return this.http.post<Tequipo>(`${environment.rutaAPI + '/tequipo'}`, equipo).pipe(
          map((response: any) => {
            //console.log(response);
            return response;
            })
        );
        
    }
    
    update(id: number, equipo: Tequipo): Observable<Tequipo> { 
        //console.log(equipo);
        return this.http.put<Tequipo>(`${environment.rutaAPI + '/tequipo/'+id}`,equipo).pipe(
          map((response: any) => {
            //console.log(response);
            return response;
            })
        );
    }
    
    delete(id: number): Observable<Tequipo> { 
        return this.http.delete<Tequipo>(`${environment.rutaAPI + '/tequipo/'+id}`).pipe(
          map((response: any) => {
            //console.log(response);
            return response;
            })
        );
    }

}