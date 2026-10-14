import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LoginService } from 'src/app/shared/login/login.service';
import swal from 'sweetalert2';


@Injectable()

export class LoginGuard implements CanActivate {

	constructor(private router: Router, private _login: LoginService) { }

	 canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this._login.usuario.pipe(
      take(1),
      map(user => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/']);
      })
    );
  }
}
