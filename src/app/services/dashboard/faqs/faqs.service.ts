import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Tfaqs } from './tfaqs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FaqsService {

    public urlEndPoint = `${environment.rutaAPI}`;

    constructor( private http: HttpClient ) { }

    getFaqs() {
        return this.http.get(this.urlEndPoint + '/tfaqs/').pipe(
        map((response: any) => {
            return response;
            })
        );
    }

    getFaq(id) {
        return this.http.get(this.urlEndPoint + '/tfaqs/'+id).pipe(
        map((response: any) => {
            return response;
            })
        );

    }

    create(noticias: Tfaqs): Observable<Tfaqs> {
        //console.log(noticias);
        return this.http.post<Tfaqs>(`${environment.rutaAPI + '/tfaqs'}`, noticias).pipe(
          map((response: any) => {
            //console.log(response);
            return response;
            })
        );
        
      }

    update(id: number, noticia: Tfaqs): Observable<Tfaqs> { 
        console.log(noticia);
        return this.http.put<Tfaqs>(`${environment.rutaAPI + '/tfaqs/'+id}`,noticia).pipe(
          map((response: any) => {
            //console.log(response);
            return response;
            })
        );
      }

    delete(id: number): Observable<Tfaqs> { 
        return this.http.delete<Tfaqs>(`${environment.rutaAPI + '/tfaqs/'+id}`).pipe(
          map((response: any) => {
            //console.log(response);
            return response;
            })
        );
      }

}