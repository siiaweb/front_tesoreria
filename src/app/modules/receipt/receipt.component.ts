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

  @BlockUI() blockUI: NgBlockUI;

  p: number = 1;

  recibos: any;
  constructor( private _ps: PagoServiciosService ) { }

  ngOnInit() {


    this._ps.getRecibos().subscribe(
      (recibos) => {
        this.recibos = recibos
        //console.log(recibos);
      }
    )

  }

  printInvoice(id,ref_banco,bandera) {
    this.blockUI.start('Descargando su recibo...');
    if (bandera==null){
      this._ps.printReceipt(id,ref_banco).subscribe((response) => {

            const file = new Blob([response], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.blockUI.stop();
        
      },
      error => {
        console.log(error);
        this.blockUI.stop();
        Swal.fire({
          title: 'ERROR!!!',
          text: error.message,
          icon: 'error'});
      });
    }else{
      this._ps.printReceiptDsto(id,ref_banco).subscribe((response) => {
  
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        console.log(error);
        Swal.fire({
          title: 'ERROR!!!',
          text: error.error.message,
          icon: 'error'});
      });
    }
  }

}
