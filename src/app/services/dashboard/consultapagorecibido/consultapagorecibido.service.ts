import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ConsultaPagoRecividoService {

    public urlEndPoint = `${environment.rutaAPI}`;

    constructor( private http: HttpClient ) { }

    getConsultaPago() {
        return this.http.get(this.urlEndPoint + '/tvpagoenescolar/').pipe(
        map((response: any) => {
            return response;
            })
        );
    }

    
}