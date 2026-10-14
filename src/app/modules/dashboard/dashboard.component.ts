import { Component, OnInit } from '@angular/core';
import { RegistrarService } from '../../services/registrar.service';
import { DescuentosService } from '../../services/dashboard/descuentos/descuentos.service';
import { Descuentos } from '../../services/dashboard/descuentos/descuentos';
import { LoginService } from 'src/app/shared/login/login.service';
import { Usuario } from 'src/app/shared/login/login.models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  today: number = Date.now();
usuario:Usuario;
  //usuarios:Usuarios[];
  //tusuario:Ttipouser[];

  descuentos: Descuentos[];
  count: Number;

  nombre: any;

  constructor( private _ds: DescuentosService, private _reg: RegistrarService, public loginService :LoginService) { }

  ngOnInit() {
    window.scroll(0, 0);
     this.loginService.usuario.subscribe({
      next:(usuario)=>{
        this.nombre=usuario.Nombre;
        this.usuario=usuario;
      },
      error:(e)=>{

      },
      complete:()=>{

      }
    })
    //this.nombre= this.loginService.nombre

    // })
    // this._reg.getUserName(sessionStorage.getItem('Login')).subscribe(
    //   (usuarios) => {
    //     this.nombre = usuarios.usua_nombre;
    //   }
    // )
    // this._reg.getTipouser().subscribe(
    //   (tusuario) => {
    //     this.tusuario = tusuario;
    //     //console.log(tusuario);
    //   }
    // )

    this._ds.getDescuento().subscribe(
      (descuentos) => {
        this.descuentos = descuentos
        //console.log(descuentos);
        this.count = this.descuentos.length;
      }
    )

  }

}
