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
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  title = "Example Angular 10 Material Dialog";
  private subscription: Subscription;
  public log: Login = new Login();

  constructor( private router: Router, private _log: LoginService ,private dialog: MatDialog) { }

  ngOnInit() {
  }

  ngOnDestroy() {
		if (this.subscription !== undefined) {
			this.subscription.unsubscribe();
		}
  }
  
  login() {
 //   this.log.password='tesoreria2025';
    this.subscription = this._log.getLogin(this.log)
      .subscribe((data: any) => {
        //console.log(data);
        
        if ( typeof data !== 'undefined' && data.length > 0) {
          swal.fire({
            icon: 'success',
            title: 'Usuario Logeado',
            text: 'Bienvenido ' + data[0].usua_nombre,
            timer: 2000
          });
          sessionStorage.Login = this.log.user.toString();
          sessionStorage.Tipo = data[0].usua_tipo_usuario.toString();
          sessionStorage.usuID = data[0].usua_id.toString();
          sessionStorage.Ures = data[0].usua_ures.toString();
          sessionStorage.Persona = data[0].usua_persona.toString();
          sessionStorage.Nombre = data[0].usua_nombre.toString();
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
      const dialogConfig = new MatDialogConfig();
      this.dialog.open(DialogBodyComponent);
    }



}
