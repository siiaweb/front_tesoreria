import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Tnoticias } from './tnoticias';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

    public urlEndPoint = `${environment.rutaAPI}`;

    constructor( private http: HttpClient ) { }

    getNoticias() {
        return this.http.get(this.urlEndPoint + '/tnoticias/').pipe(
        map((response: any) => {
            return response;
            })
        );
    }

    getNoticia(id) {
        return this.http.get(this.urlEndPoint + '/tnoticias/'+id).pipe(
        map((response: any) => {
            return response;
            })
    );

  }

  create(noticias: Tnoticias): Observable<Tnoticias> {
    
    return this.http.post<Tnoticias>(`${environment.rutaAPI + '/tnoticias'}`, noticias).pipe(
      map((response: any) => {
        
        return response;
        })
    );
    
  }

  update(id: number, noticia: Tnoticias): Observable<Tnoticias> { 

    return this.http.put<Tnoticias>(`${environment.rutaAPI + '/tnoticias/'+id}`,noticia).pipe(
      map((response: any) => {
       
        return response;
        })
    );
  }

  delete(id: number): Observable<Tnoticias> { 
    return this.http.delete<Tnoticias>(`${environment.rutaAPI + '/tnoticias/'+id}`).pipe(
      map((response: any) => {
    
        return response;
        })
    );
  }
  
}