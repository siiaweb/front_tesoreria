import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../environments/environment';
import { Ttipouser } from '../shared/registrar/ttipouser';
import { Tnivelures } from '../shared/registrar/tnivelures';
import { Ures } from '../shared/registrar/ures';
import { Programas } from '../shared/registrar/programas';
import { Usuarios } from '../shared/registrar/usuarios';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrarService {

  public urlEndPoint = `${environment.rutaAPI}`;
public urlEndPointPUBLICO = `${environment.rutaPublica}`;
  constructor( private http: HttpClient ) { }

  getTtipouser(): Observable<Ttipouser[]> {
    return this.http.get(`${this.urlEndPointPUBLICO}` + '/ttipouser').pipe(
      map(response => response as Ttipouser[])
    );
  }


  getTipouser(){
    return this.http.get(this.urlEndPointPUBLICO + '/ttipouser/'+sessionStorage.getItem('Tipo')).pipe(
      map((response: any) => {
        return response;
        })
    );
  }

  getTnivelures(): Observable<Tnivelures[]> {
    return this.http.get(`${environment.rutaPublica}` + '/tnivelures').pipe(
      map(response => response as Tnivelures[])
    );
  }

  getUres(): Observable<Ures[]> {
    return this.http.get(`${environment.rutaPublica}` + '/tvures').pipe(
      map(response => response as Ures[])
    );
  }

  getPrograma(id:number): Observable<Programas> {
    return this.http.get(`${environment.rutaPublica}/tvprogramas/${id}`).pipe(
      map(response => response as Programas)
    );

  }

  getProgramas(): Observable<Programas[]> {
    return this.http.get(`${environment.rutaPublica}/tvprogramas`).pipe(
      map(response => response as Programas[])
    );
  }

  getBuscaNombre(tipoUser: string, matricula: string){
    return this.http.get(`${environment.rutaPublica}/buscaNombre/${tipoUser}/${matricula}`).pipe(
      map((response: any) => {
        return response;
        })
      );
  }

  getUserName(user: string) {
    return this.http.post(`${environment.rutaPublica}/tusuarios/${user}`,user).pipe(
      map((response: any) => {
            return response;
            })
    );
  }

  create(usuario: Usuarios): Observable<Usuarios> {
    //const user = sessionStorage.Login;
    return this.http.post<Usuarios>(`${environment.rutaPublica + '/tusuarios'}`, usuario);
  }

  changePassword(usuario: Usuarios): Observable<Usuarios> {
    //const user = sessionStorage.Login;
    return this.http.post<Usuarios>(`${environment.rutaPublica}`+ '/tusuariosPass/'+sessionStorage.getItem('Login'), usuario);
  }

}
