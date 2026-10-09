import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

export interface DialogData {
  id: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class ListaUsuariosService {

  public urlEndPoint = `${environment.rutaAPI}`;

  constructor(private http: HttpClient) { }





  getListaUsuario() {
    return this.http.get(this.urlEndPoint + '/tvusuarios/' + sessionStorage.getItem('usuID')).pipe(
      map((response: any) => {
        return response;
      })
    );

  }



}