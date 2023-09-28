import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Tvpagossiia } from '../../services/dashboard/pagossiia/tvpagossiia';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PagoServiciosService, PagosSiiaService } from '../../services/services.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagossiia',
  templateUrl: './pagossiia.component.html',
  styleUrls: ['./pagossiia.component.scss']
})
export class PagossiiaComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;

  displayedColumns: string[] = ['vmae_foliopago','vmae_fecha','vmae_usuario','vmae_nombre_usuario','vmae_ures',
                                'vmae_program','vmae_tipouser','vmae_descripcion','vmae_referencia',
                                'vmae_est_descrip','vmae_foldescto','vmae_importe','vmae_estatus'];
  public dataSource = new MatTableDataSource<Tvpagossiia>();

  private subscription: Subscription;

  constructor( private _psi: PagosSiiaService, private _ps: PagoServiciosService ) { }

  ngOnInit() {

    this.subscription = this._psi.getPagos().subscribe(
      (tvpagossiia) => {
        console.log(tvpagossiia);
        this.dataSource.data = tvpagossiia as Tvpagossiia[];
        console.log(this.dataSource);
      }
    )

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  printInvoice(id,ref_banco,bandera) {
    this.blockUI.start('Descargando recibo...');
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
