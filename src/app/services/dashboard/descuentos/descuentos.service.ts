import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Descuentos } from './descuentos';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DescuentosService {

    public urlEndPoint = `${environment.rutaAPI}`;

  constructor( private http: HttpClient ) { }

  getDescuentos() {
        return this.http.get(this.urlEndPoint + '/tvdescuentos/').pipe(
      map((response: any) => {
        return response;
        })
    );

  }

  getDescuento() {
        //return this.http.get(this.urlEndPoint + '/fdesctos/'+sessionStorage.getItem('Ures')+'/'+sessionStorage.getItem('Persona')).pipe(
        return this.http.get(this.urlEndPoint + '/tvdescuentos/'+sessionStorage.getItem('Ures')+'/'+sessionStorage.getItem('Persona')).pipe(
      map((response: any) => {
        return response;
        })
    );

  }

  getDescuentoDet(IDDescuento) {
    //return this.http.get(this.urlEndPoint + '/tvdescuentosdet/'+sessionStorage.getItem('Ures')+'/'+sessionStorage.getItem('Persona')).pipe(
      return this.http.get(this.urlEndPoint + '/tvdescuentosdet/'+IDDescuento).pipe(
  map((response: any) => {
    return response;
    })
);

}

}