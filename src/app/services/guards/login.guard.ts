import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import swal from 'sweetalert2';
import { LoginService } from '../login.service';

@Injectable()

export class LoginGuard implements CanActivate {

	constructor(private router: Router, private _login: LoginService) { }

	canActivate(): boolean {
		console.log("entra al canActivate");
		if (this._login.estaLogueado()) {
			console.log("canActivate true");
			return true;
		} else {
			//console.log('Bloqueado por el LOGIN GUARD');
			if (this.router.url.trim() !== '/') {
				swal.fire({
					title: 'ATENCIÓN!!!',
					text: 'No ha iniciado sesión o se perdió la sesión del usuario',
					icon: 'warning'})
				.then((result) => {
					if (result) {
						this.router.navigate(['']);
						return false;
					}
				});
				console.log("canActivate false 1");
			} else {
				console.log("canActivate false 2");
				this.router.navigate(['']);
				return false;
			}
		}
	}
}
