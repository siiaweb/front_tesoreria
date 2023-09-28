import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Tvusuario } from './tvusuario';
import { DialogData } from '../../../modules/resetpass/resetpass.component';

@Injectable({
  providedIn: 'root'
})
export class ListaUsuariosService {

    public urlEndPoint = `${environment.rutaAPI}`;

  constructor( private http: HttpClient ) { }

  getListaUsuarios() {
      return this.http.get(this.urlEndPoint + '/tvusuarios/').pipe(
      map((response: any) => {
        return response;
        })
    );

  }

  //Filtra los usuarios para que no aparezca el tipo user 50,60,70,80,90
  getListaUsuariosFiltro() {
    return this.http.get(this.urlEndPoint + '/tvusuariosfiltro/').pipe(
    map((response: any) => {
      return response;
      })
  );

}

  getListaUsuario() {
    return this.http.get(this.urlEndPoint + '/tvusuarios/'+sessionStorage.getItem('usuID')).pipe(
    map((response: any) => {
      return response;
      })
  );

}

updatePassword(data:DialogData): Observable<DialogData> { 
  //console.log(equipo);
  return this.http.put<DialogData>(`${environment.rutaAPI + '/actPassUser/'+data.id}`,data.password).pipe(
    map((response: any) => {
      //console.log(response);
      return response;
      })
  );
}

}