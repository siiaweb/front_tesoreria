import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/services.index';
import { Tservicios } from '../../services/dashboard/servicios/tservicios';
import {Router, ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  p: number = 1;

  private subscription: Subscription;
  tservicios: Tservicios[];

  constructor( private _ss: ServiciosService, public router: Router ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.subscription = this._ss.getServicios().subscribe(
      (tservicios) => {
        this.tservicios = tservicios;
        //console.log(this.tservicios);
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
        this._ss.delete(id).subscribe(master => {
          this.subscription = this._ss.getServicios().subscribe(
            (tservicios) => {
              this.tservicios = tservicios;
            }
          )
          Swal.fire({icon: 'success',title: 'Servicio Eliminado',showConfirmButton: false,timer: 3000});
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
