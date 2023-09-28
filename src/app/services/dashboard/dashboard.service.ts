import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Roles } from './roles'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor( private http: HttpClient ) { }

  getRol(id:string): Observable<Roles[]> {
    return this.http.get(`${environment.rutaAPI}/rolsusuario/${id}`).pipe(
      map(response => response as Roles[])
    );
  }

}