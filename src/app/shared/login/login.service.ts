import { Injectable } from "@angular/core";
import { BehaviorSubject, interval, Subscription, throwError } from "rxjs";
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { Usuario } from "./login.models";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
export interface AuthResponseData {

}

export interface UsuarioDTO {
  Nombre: string;
  Persona: string;
  Tipo: string;
  Ures: string;
  usuId: number;
  Login: string;
}

export interface UsuarioResponse {
  usua_nombre: string;
  usua_persona: string;
  usua_tipo_usuario: string;
  usua_ures: string;
  usua_id: number;
  token?: string;
  tipoDescrip: string;
  // Login: string;
}


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private countdownSubscription?: Subscription;
  private readonly remainingSecondsSubject = new BehaviorSubject<number>(0);
  readonly remainingSeconds$ = this.remainingSecondsSubject.asObservable()

  constructor(private http: HttpClient, public router: Router) {

  }
  usuario = new BehaviorSubject<Usuario>(null);
  public urlEndPointPUBLICO = `${environment.rutaPublica}`;
  private tokenExpirationTimer: any;
  ingresar(username: string, password: string) {
    const urlLogin = this.urlEndPointPUBLICO + '/tusuarios/' + username + '/' + password;
    return this.http.post<UsuarioResponse>(urlLogin, {}).pipe(
      catchError(LoginService.handleError),
      tap(response => {
       /*   sessionStorage.Login = username.toString();
          sessionStorage.Tipo = response.usua_tipo_usuario.toString();
          sessionStorage.usuID = response.usua_id.toString();
          sessionStorage.Ures = response.usua_ures.toString();
          sessionStorage.Persona = response.usua_persona.toString();
          sessionStorage.Nombre = response.usua_nombre.toString();*/
        const Login = username;
        const Tipo = response.usua_tipo_usuario.toString();
        const usuID = +response.usua_id;
        const Ures = response.usua_ures.toString();
        const Persona = response.usua_persona.toString();
        const Nombre = response.usua_nombre.toString();
        const tipoDescrip = response.tipoDescrip;
        const token = response.token;
        const { exp } = jwtDecode<{ exp: number }>(token);
        this.handleAuthentication(
          Nombre, Persona, Tipo, Ures, usuID, Login, exp, token, tipoDescrip
        );
      })
    );
  }
  private handleAuthentication(
    Nombre: string,
    Persona: string,
    Tipo: string,
    Ures: string,
    usuId: number,
    Login: string,
    exp: number,
    token: string,
    tipoDescrip: string
  ) {
    console.log('usuario')

    const usuario = new Usuario(Nombre, Persona, Tipo, Ures, usuId, Login, token, exp, tipoDescrip);
    this.usuario.next(usuario);
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    //this.autoLogout(exp);
    this.autoLogout(exp * 1000 - Date.now());
  }
  private static handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    let errorType = 'desconocido';
    const estatus = errorRes.status;
    if (errorRes.status == 401) {
      errorMessage = errorRes.statusText;
    }
    if (errorRes.status == 503) {
      return throwError({
        estatus,
        message: "Servicio no disponible, favor de intentarlo más tarde"
      });
    }
    if (!errorRes.error || !errorRes.error.error) {
      return throwError({ message: errorMessage, errorType: errorType });
    }
    switch (errorRes.error.error) {
      case 'invalid_grant':
        errorMessage = 'Usuario y/o contraseña incorrecta';
        errorType = 'usuario/contraseña incorrecta';
        break;
      case 'unauthorized':
        errorMessage = 'MOTIVO:' + errorRes.error.error_description;
        errorType = 'Acceso denegado';
        break;
      default:
        errorMessage = errorRes.error.error_description;
        errorType = errorRes.error.error;
      // code block
    }
    return throwError({ message: errorMessage, errorType: errorType });
  }


  get nombre() {
    return this.usuario?.getValue()?.Nombre;
  }
  logout() {
    sessionStorage.clear();
    clearTimeout(this.tokenExpirationTimer);
    this.countdownSubscription?.unsubscribe();
    this.remainingSecondsSubject.next(0);
    this.tokenExpirationTimer = null;
    this.router.navigate(['']);
  }

  autoLogin() {
    const userData: {
      Nombre: string
      Persona: string;
      Tipo: string;
      Ures: string;
      usuId: number;
      Login: string;
      token: string;
      exp: number;
      tipoDescrip: string;
    } = JSON.parse(sessionStorage.getItem('usuario'));

    if (!userData) {
      this.logout();
      return;
    }

    const loadedUser = new Usuario(
      userData.Nombre,
      userData.Persona,
      userData.Tipo,
      userData.Ures,
      + userData.usuId,
      userData.Login,
      userData.token,
      userData.exp,
      userData.tipoDescrip
    );

    if (loadedUser.token) {

      this.usuario.next(loadedUser);
      //const expirationDuration = new Date(userData.exp).getTime() - new Date().getTime();
      const expirationDuration = userData.exp * 1000 - Date.now();
      const urlpath = window.location.href.replace(window.location.origin, "").replace("/#", "");
      if (urlpath === '/' || urlpath === '/alumnos/') {
        this.router.navigate(['/dashboard']);
      }
      this.autoLogout(expirationDuration);

    }
  }
autoLogout(expirationDuration: number) {
  clearTimeout(this.tokenExpirationTimer);
  this.countdownSubscription?.unsubscribe();

  const duration = Math.max(0, expirationDuration);
  const expiresAt = Date.now() + duration;

  const updateCountdown = () => {
    const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    this.remainingSecondsSubject.next(seconds);
  };

  updateCountdown();

  if (duration === 0) {
    this.logout();
    return;
  }

  this.countdownSubscription = interval(1000).subscribe(updateCountdown);
  this.tokenExpirationTimer = setTimeout(() => this.logout(), duration);
}
}