import { Component,OnInit } from '@angular/core';
import { Login } from './login';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';
import { environment } from '../../../environments/environment';
import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private subscription: Subscription;
  public log: Login = new Login();

  constructor( 
    private router: Router, 
    private _log: LoginService ,
    private dialog: MatDialog,) { }

  ngOnInit() {
  }

  ngOnDestroy() {
		if (this.subscription !== undefined) {
			this.subscription.unsubscribe();
		}
  }
  
  login() {
    this.subscription = this._log.getLogin(this.log)
      .subscribe((data: any) => {
        console.log('DATA',data);
        console.warn(typeof data !== 'undefined',data.length > 0)
        if ( typeof data !== 'undefined' && data['token'].length > 0) {
          swal.fire({
            icon: 'success',
            title: 'Usuario Logeado',
            text: 'Bienvenido ' + data.usua_nombre,
            timer: 2000
          });
          sessionStorage.Login = this.log.user.toString();
          sessionStorage.Tipo = data.usua_tipo_usuario.toString();
          sessionStorage.usuID = data.usua_id.toString();
          sessionStorage.Ures = data.usua_ures.toString();
          sessionStorage.Persona = data.usua_persona.toString();
          sessionStorage.Nombre = data.usua_nombre.toString();
          sessionStorage.token=data.token;
          this.router.navigate(['/dashboard']);
        } else{
          swal.fire({
            icon: 'error',
            title: 'Usuario y/o contraseña incorrecta'
          });
        }	
      },
      error => {
        //console.log(error.error.Message);
        swal.fire({
          title: 'ERROR!!!',
          text: error.error.Message,
          icon: 'error'});
      });
    }

    portal(){
      window.location.href = `${environment.rutaPortal}`;
    }


    openDialog() {
      const dialogRef = this.dialog.open(DialogBodyComponent, {
        panelClass: 'dialogo-responsivo',
        maxWidth: "100vw"
      });
    }

}
