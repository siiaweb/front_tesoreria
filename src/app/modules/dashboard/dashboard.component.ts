import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistrarService } from '../../services/registrar.service';
import { Usuarios } from '../../shared/registrar/usuarios';
import { DescuentosService } from '../../services/dashboard/descuentos/descuentos.service'; 
import { Descuentos } from '../../services/dashboard/descuentos/descuentos';
import { Ttipouser } from '../../shared/registrar/ttipouser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  today: number = Date.now();

  usuarios:Usuarios[];
  tusuario:Ttipouser[];
  descuentos: Descuentos[];
  count: Number;

  nombre: any;

  constructor( private _ds: DescuentosService, private _reg: RegistrarService) { }

  ngOnInit() {
    window.scroll(0, 0);

    this._reg.getUserName(sessionStorage.getItem('Login')).subscribe(
      (usuarios) => {
        this.nombre = usuarios.usua_nombre;
      }
    )

    this._reg.getTipouser().subscribe(
      (tusuario) => {
        this.tusuario = tusuario;
        //console.log(tusuario);
      }
    )

    this._ds.getDescuento().subscribe(
      (descuentos) => {
        this.descuentos = descuentos
        //console.log(descuentos);
        this.count = this.descuentos.length;
      }
    )

  }

}
