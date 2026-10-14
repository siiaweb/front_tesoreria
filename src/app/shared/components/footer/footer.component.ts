import { Component, OnInit } from '@angular/core';
import { ListaUsuariosService } from '../../../services/dashboard/listausuarios/listausuarios.service';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  tipoUsuario: string;
  uresUsuario: string;

  constructor( private authService: LoginService ) { }

  ngOnInit() {
    this.authService.usuario.subscribe({
      next:(usuario)=>{
        this.tipoUsuario=usuario.Tipo;
        this.uresUsuario=usuario.Ures;
      },
      error:(e)=>{
        console.error('e',e)
      },
      complete:()=>{

      }
    })

  }

}
