import { Component, OnInit } from '@angular/core';
import { PagoServiciosService } from '../../services/dashboard/pagoServicios/pagoservicios.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  p: number = 1;

  recibos: any;
  constructor( private _ps: PagoServiciosService ) { }

  ngOnInit() {

    const usuario = sessionStorage.getItem('usuID');

    if (!usuario) {
      console.error('No existe usuID en sessionStorage');
      return;
    }
    this._ps.getRecibosPagosOnline(usuario).subscribe(
      (recibos) => {
        this.recibos = recibos
        //console.log(recibos);
      }
    )

  }

  printInvoice(id: any,ref_banco: any,bandera: null) {
    console.warn('params',id,ref_banco,bandera)
    this.blockUI.start('Descargando su recibo...');
    if (bandera==null){
      this._ps.printReceipt(id,ref_banco).subscribe((response: BlobPart) => {

            const file = new Blob([response], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.blockUI.stop();
        
      },
        (      error: { message: any; }) => {
        console.log(error);
        this.blockUI.stop();
        Swal.fire({
          title: 'ERROR!!!',
          text: error.message,
          icon: 'error'});
      });
    }else{
      this._ps.printReceiptDsto(id,ref_banco).subscribe((response: BlobPart) => {
  
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.blockUI.stop();
      },
        (      error: { error: { message: any; }; }) => {
        this.blockUI.stop();
        console.log(error);
        Swal.fire({
          title: 'ERROR!!!',
          text: error.error.message,
          icon: 'error'});
      });
    }
  }

  generarCartaNoAdeudo(id: string, ref: string){
    console.log(id);
    this._ps.getCartaNoAdeudo(id, ref).subscribe(resp =>{
      let blob = new Blob([resp], {type: resp.type});
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    },error => {
      this.blockUI.stop();
      console.log(error);
      Swal.fire({
        title: 'AVISO!!', text: "Error al cargar carta, inténtelo de nuevo", icon: 'error'
      });
    });
  }

}
