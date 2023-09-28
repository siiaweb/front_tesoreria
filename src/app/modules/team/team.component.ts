import { Component, OnInit } from '@angular/core';
import { EquipoService } from '../../services/dashboard/equipo/equipo.service';
import { Tequipo } from '../../services/dashboard/equipo/tequipo';
import {Router, ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  p: number = 1;

  private subscription: Subscription;
  tequipo: Tequipo[];

  constructor( private _es: EquipoService, public router: Router ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.subscription = this._es.getEquipos().subscribe(
      (tequipo) => {
        this.tequipo = tequipo;
        //console.log(this.tequipo);
      }
    )
  }

  delete(id, titulo){
    Swal.fire({
      title: '¿Estás seguro?',
			text: 'Se eliminara ' + titulo,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
			confirmButtonColor: '#3085d6',
			confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.value) {
        this._es.delete(id).subscribe(master => {
          this.subscription = this._es.getEquipos().subscribe(
            (tequipo) => {
              this.tequipo = tequipo;
            }
          )
          Swal.fire({icon: 'success',title: 'Registro Eliminado',showConfirmButton: false,timer: 3000});
        },
        error => {
          console.log(error);
          Swal.fire({
            title: 'ERROR!!!',
            text: error.error.message,
            icon: 'error'});
        })
      }
    })
  }

}
