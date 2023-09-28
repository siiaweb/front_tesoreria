import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Tvpagoenescolar } from '../../services/dashboard/consultapagorecibido/tvpagoenescolar';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PagoServiciosService, ConsultaPagoRecividoService } from '../../services/services.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consulta-pago-recibido',
  templateUrl: './consulta-pago-recibido.component.html',
  styleUrls: ['./consulta-pago-recibido.component.scss']
})
export class ConsultaPagoRecibidoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;

  displayedColumns: string[] = ['reci_folio','reci_fecha','reci_alumno','reci_ures','reci_concepto',
  'reci_cantidad',  'reci_punit',  'reci_importe',  'reci_descuento',  'reci_total',
  'reci_frecepcion',  'reci_comentarios'];
  public dataSource = new MatTableDataSource<Tvpagoenescolar>();

  private subscription: Subscription;

  constructor( private _cpr: ConsultaPagoRecividoService ) { }

  ngOnInit() {

    this.subscription = this._cpr.getConsultaPago().subscribe(
      (tvpagoenescolar) => {
        console.log(tvpagoenescolar);
        this.dataSource.data = tvpagoenescolar as Tvpagoenescolar[];
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

}
