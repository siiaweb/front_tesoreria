import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Tbanners } from './tbanners';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BannersService {

    public urlEndPoint = `${environment.rutaAPI}`;

    constructor( private http: HttpClient ) { }

    getBanners() {
        return this.http.get(this.urlEndPoint + '/tbanner/').pipe(
        map((response: any) => {
            return response;
            })
        );
    }

    getBanner(id) {
        return this.http.get(this.urlEndPoint + '/tbanner/'+id).pipe(
        map((response: any) => {
            return response;
            })
    );

  }

  
}