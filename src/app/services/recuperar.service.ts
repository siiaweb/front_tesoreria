import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { recuperaPass } from '../shared/dialog-body/recuperaPass';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecuperarService {

  constructor(private http: HttpClient, public router: Router ) { }

  public urlEndPoint = `${environment.rutaAPI}`;
  usuario:string;
  email:string;

  getUsuariosEmail(recupera: recuperaPass): Observable<recuperaPass[]>  {
    //console.log(recupera);
    this.usuario=recupera.usua_usuario;
    this.email=recupera.usua_email;
    //console.log(this.http.get(`${environment.rutaAPI + '/recuperaPass?usua_usuario=' + this.usuario+'&usua_email='+this.email}`));
    return this.http.get(`${environment.rutaAPI + '/recuperaPass?usua_usuario=' + this.usuario+'&usua_email='+this.email}`).pipe(
      map(response => response as recuperaPass[])
      //console.log(response)
      //response as recuperaPass[]
    );
    //return this.http.get(`${environment.rutaAPI + '/recuperaPass?usua_usuario=' + this.usuario+'&usua_email='+this.email}`);
    
  }
}
