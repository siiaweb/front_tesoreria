import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../../services/dashboard/noticias/noticias.service';
import { Tnoticias } from '../../services/dashboard/noticias/tnoticias';
import { Subscription } from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  p: number = 1;

  private subscription: Subscription;
  tnoticias: Tnoticias[];
  
  constructor( private _ns: NoticiasService, public router: Router ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.subscription = this._ns.getNoticias().subscribe(
      (noticias) => {
        this.tnoticias = noticias;
        //console.log(this.tnoticias);
      }
    )

  }

  subirImagen(id){
    console.log(id);
  }

  delete(id, tituloNoticia){
    Swal.fire({
      title: '¿Estás seguro?',
			text: 'Se eliminara ' + tituloNoticia,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
			confirmButtonColor: '#3085d6',
			confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.value) {
        this._ns.delete(id).subscribe(master => {
          this.subscription = this._ns.getNoticias().subscribe(
            (noticias) => {
              this.tnoticias = noticias;
            }
          )
          Swal.fire({icon: 'success',title: 'Noticia Eliminada',showConfirmButton: false,timer: 3000});
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
