import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { RegistrarService } from '../../../services/registrar.service';
import { Usuarios } from '../../../shared/registrar/usuarios';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  usuarios:Usuarios[];
  badges:any;

  nombre: any;

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor( private _login: LoginService, private _reg: RegistrarService ) {

    //this.badges = sessionStorage.getItem('shoppingCart').length.subscribe

   }

  ngOnInit() {

    this._reg.getUserName(sessionStorage.getItem('Login')).subscribe(
      (usuarios) => {
        //this.usuarios = usuarios;
        this.nombre = usuarios.usua_nombre;
        //console.log(this.nombre);
      }
    )

   }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  cerrarSesion() {
		this._login.logout();
	}

}
