import { Component, OnInit } from '@angular/core';
import { Login } from './login';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { BlockUIService } from 'ng-block-ui';
import { erroresFormulario } from 'src/app/modules/componentes-genericos/manejo-errores-forma/errores';
import { LoginService } from './login.service';

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
    private _log: LoginService,
    private dialog: MatDialog,
    private blockUIService: BlockUIService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  login() {
    this.blockUIService.start('global', 'cargando login')
    console.warn('ingresando')
    if (this.log.user === undefined || this.log.password === undefined) {
      swal.fire({
        icon: 'info',
        title: 'Ingrese sus datos'
      });
    } else {
      this.subscription = this._log.ingresar(this.log.user, this.log.password)
        .subscribe({
          next: (data) => {
            this.blockUIService.stop('global')
            swal.fire({
              icon: 'success',
              title: 'Usuario Logeado',
              text: 'Bienvenido ' + data.usua_nombre,
              timer: 1000
            });
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.blockUIService.stop('global')
            erroresFormulario.handleError(error);
            console.error('error', error)
          },
          complete: () => {
            this.blockUIService.stop('global')
          }
        });
    }
  }
  togglePassword(elementId: string) {
    const input = (<HTMLInputElement>document.getElementById(elementId));
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  }

  portal() {
    window.location.href = `${environment.rutaPortal}`;
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogBodyComponent, {
      panelClass: 'dialogo-responsivo',
      maxWidth: "100vw"
    });
  }

}
