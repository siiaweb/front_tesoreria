import { Component, OnInit } from '@angular/core';
import { FaqsService } from '../../services/dashboard/faqs/faqs.service';
import { Tfaqs } from '../../services/dashboard/faqs/tfaqs';
import { Subscription } from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {

  p: number = 1;

  private subscription: Subscription;
  tfaqs: Tfaqs[];

  constructor( private _fs: FaqsService, public router: Router ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.subscription = this._fs.getFaqs().subscribe(
      (faqs) => {
        this.tfaqs = faqs;
        //console.log(this.tfaqs);
      }
    )
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
        this._fs.delete(id).subscribe(master => {
          this.subscription = this._fs.getFaqs().subscribe(
            (faqs) => {
              this.tfaqs = faqs;
              //console.log(this.tfaqs);
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
