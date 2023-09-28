import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PagosSiiaService {

    public urlEndPoint = `${environment.rutaAPI}`;

    constructor( private http: HttpClient ) { }

    getPagos() {
        return this.http.get(this.urlEndPoint + '/tvmaestropagos/').pipe(
        map((response: any) => {
            return response;
            })
        );
    }

    getPago(id) {
        return this.http.get(this.urlEndPoint + '/tvmaestropagos/'+id).pipe(
        map((response: any) => {
            return response;
            })
    );

  }

    
}