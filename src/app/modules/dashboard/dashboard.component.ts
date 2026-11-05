import { Component, OnInit } from '@angular/core';
import { RegistrarService } from '../../services/registrar.service';
import { DescuentosService } from '../../services/dashboard/descuentos/descuentos.service';
import { Descuentos } from '../../services/dashboard/descuentos/descuentos';
import { LoginService } from 'src/app/shared/login/login.service';
import { Usuario } from 'src/app/shared/login/login.models';
import { BlockUIService } from 'ng-block-ui';
import { erroresFormulario } from '../componentes-genericos/manejo-errores-forma/errores';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {

  today: number = Date.now();
  usuario: Usuario;


  descuentos: Descuentos[];
  count: Number;

  nombre: any;

  constructor(
    private _ds: DescuentosService,
    public loginService: LoginService,
    private blockUIService: BlockUIService,
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.loginService.usuario.subscribe({
      next: (usuario) => {
        this.nombre = usuario.Nombre;
        this.usuario = usuario;
      },
      error: (error) => {
        this.blockUIService.stop('global')
        console.error('error', error)
        erroresFormulario.handleError(error);
      },
      complete: () => {

      }
    })


    this._ds.getDescuento().subscribe({
      next: (descuentos) => {
        this.descuentos = descuentos
        //console.log(descuentos);
        this.count = this.descuentos.length;
      },
      error: (error) => {
        this.blockUIService.stop('global')
        console.error('error', error)
        erroresFormulario.handleError(error);
      }
    })

  }

}
