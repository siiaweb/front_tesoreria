import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Tvreciboalumno } from './tvreciboalumno';
import { EpagoRecibo } from './epagorecibo ';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecepcionRecibosService {

    public urlEndPoint = `${environment.rutaAPI}`;

    constructor( private http: HttpClient ) { }

    getRecibos() {
        return this.http.get(this.urlEndPoint + '/reciboalumno/').pipe(
        map((response: any) => {
            return response;
            })
        );
    }

    getRecibo(id) {
      return this.http.get(this.urlEndPoint + '/reciboalumno/'+id).pipe(
        map((response: any) => {
            return response;
            })
      );

    }

    update(Folio: Number, FolioDet: Number, epagoRecibo: EpagoRecibo): Observable<EpagoRecibo>{ 
      console.log(Folio, FolioDet, epagoRecibo);
      
      //return this.http.put(`${environment.rutaAPI + '/epagorecibo/'+Folio+'/'+FolioDet+'/'+sessionStorage.getItem('Login')+'/'+Comentario}`,Tvreciboalumno).pipe(
        //return this.http.put<Tvreciboalumno>(`${environment.rutaAPI + '/epagorecibo/'+Folio+'/'+FolioDet}`,Tvreciboalumno).pipe(
        //return this.http.put<Tvreciboalumno>(`${environment.rutaAPI + '/epagorecibo/'}`+Folio+'/'+FolioDet,Tvreciboalumno).pipe(
        return this.http.put<EpagoRecibo>(`${environment.rutaAPI + '/epagorecibo/'+FolioDet+'/'+Folio}`,epagoRecibo).pipe(
        map((response: any) => {
          //console.log(response);
          return response;
          })
      );
    }

  /*
  create(noticias: Tnoticias): Observable<Tnoticias> {
    //console.log(noticias);
    return this.http.post<Tnoticias>(`${environment.rutaAPI + '/tnoticias'}`, noticias).pipe(
      map((response: any) => {
        //console.log(response);
        return response;
        })
    );
    
  }


  delete(id: number): Observable<Tnoticias> { 
    return this.http.delete<Tnoticias>(`${environment.rutaAPI + '/tnoticias/'+id}`).pipe(
      map((response: any) => {
        //console.log(response);
        return response;
        })
    );
  }
  */
}