import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {exhaustMap, take} from "rxjs/operators";
import { LoginService } from './login.service';



@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: LoginService) {}

  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //console.log('interceptor');
    return this.authService.usuario.pipe(
      take(1),
      exhaustMap(user => {
        if(req.url.includes("token")){
          return next.handle(req);
        }
        if (!user) {
          return next.handle(req);
        }
        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + user.token,

          'Content-Type': 'application/json'
        });

        const modifiedReq = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + user.token)
//headers
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
