import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../shared/login/login';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Usuarios } from '../shared/registrar/usuarios';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private http: HttpClient, public router: Router ) { }

  public urlEndPoint = `${environment.rutaAPI}`;


	getLogin(login: Login) {
		//return this.http.post<Usuarios>(this.urlEndPoint + '/tusuarios/'+login.user+'/'+login.password, login).pipe(
		return this.http.post(this.urlEndPoint + '/tusuarios/'+login.user+'/'+login.password, login).pipe(
          map((response: any) => {
            return response;
            })
		);

      }

  logout() {
    sessionStorage.removeItem('Login');
    sessionStorage.removeItem('Tipo');
    sessionStorage.removeItem('shoppingCart');
    sessionStorage.removeItem('usuID');
    sessionStorage.removeItem('Ures');
    sessionStorage.removeItem('Persona');
		// sessionStorage.removeItem(_TOKEN);
		this.router.navigate(['']);
  }
  
  estaLogueado() {
		 if (sessionStorage.removeItem('Login') === null) {
      return false;
		} else {
      //return true;
      return (sessionStorage.getItem('Login'));
		}
  }
  
}
