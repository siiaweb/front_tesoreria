import { Component, OnInit } from '@angular/core';
import { ListaUsuariosService } from '../../../services/dashboard/listausuarios/listausuarios.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  tipoUsuario: string;
  uresUsuario: string;
  
  constructor( private _lus: ListaUsuariosService ) { }

  ngOnInit() {
    this._lus.getListaUsuario().subscribe(
      (usuario) => {
        this.tipoUsuario = usuario[0].tipo_usuario;
        this.uresUsuario = usuario[0].unidad_responsable;
        console.log(usuario);
      }
    )
  }

}
