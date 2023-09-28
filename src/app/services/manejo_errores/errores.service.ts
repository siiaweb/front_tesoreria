import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Errores } from './errores';

@Injectable({
  providedIn: 'root'
})
export class ErroresService {

  constructor( private http: HttpClient ) { }

  getErrores(): Observable<Errores[]> {
    return this.http.get(`${environment.rutaAPI}/cwerrmsj/`).pipe(
      map(response => response as Errores[])
    );
  }

  getError(id:string): Observable<Errores> {
    return this.http.get(`${environment.rutaAPI}/cwerrmsj/${id}`).pipe(
      map(response => response as Errores)
    );
  }

}