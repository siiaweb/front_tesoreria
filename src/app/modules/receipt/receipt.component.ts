import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PagoServiciosService } from '../../services/dashboard/pagoServicios/pagoservicios.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { EvoService } from 'src/app/services/dashboard/evo.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  resultIndicator: string | null = null;
  @BlockUI() blockUI!: NgBlockUI;

  p: number = 1;

  recibos: any;
  constructor(
    private _ps: PagoServiciosService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private _evo: EvoService
  ) {
    //alert('constructor');

  }

  ngOnInit() {

    const usuario = sessionStorage.getItem('usuID');
    this.resultIndicator =
      this.route.snapshot.queryParamMap.get('resultIndicator');

    if (!usuario) {
      console.error('No existe usuID en sessionStorage');
      return;
    }
    const referencia = sessionStorage.getItem('MasterID');
    const resultIndicator =
      this.route.snapshot.queryParamMap.get('resultIndicator');

    this.resultIndicator = resultIndicator;

    if (!usuario) {
      console.error('Faltan datos para procesar el recibo:', {
        usuario
      });
      return;
    }
    this.blockUI.start('cargando...<espere por favor>')
    this._ps.getRecibosPagosOnline(usuario).pipe(

      switchMap((recibos: Array<any>) => {
        this.recibos = recibos;

        if (!resultIndicator) {
          return EMPTY;
        }
        const recibo = this.recibos.slice().find(
          item => {

            return item.successIndicator === resultIndicator && item.estatus == 'P'
          }
        );

        // alert('wait')

        if (!recibo) {
          this.blockUI.stop();
          console.log('No se encontró un recibo pendiente para este resultIndicator.');
          return EMPTY;
        }

        if (!referencia) {
          this.blockUI.stop();
          console.error('No existe MasterID en sessionStorage.');
          return EMPTY;
        }
        return this._evo.insertarRespuestaConPdf(referencia, resultIndicator);
      })
    ).subscribe({
      next: response => {
        this.blockUI.stop();
        console.warn('cambiando')
        const disposition = response.headers.get('Content-Disposition');
        this.recibos = this.recibos.map((item: any) =>
          item.successIndicator === resultIndicator
            ? { ...item, estatus: 'A' }
            : item
        );
        const coincidencia = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
        let nombre = coincidencia && coincidencia[1]
          ? coincidencia[1].replace(/"/g, '')
          : 'reporte.pdf';
        try {
          nombre = decodeURIComponent(nombre);
        } catch {
          // Conserva el nombre original si no tiene codificación URL válida.
        }
        sessionStorage.removeItem("MasterID");
        sessionStorage.removeItem("shoppingCart");
        // alert('test')
        const blob = new Blob([response.body], { type: 'application/pdf' });
        if (!blob) {
          console.error('La respuesta no contiene el PDF.');
          return;
        }
        //alert('?')
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = decodeURIComponent(nombre);
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this._evo.stopPolling();
      },
      error: error => {
        this.blockUI.stop();
        console.error('Error en el flujo:', error)
      },
      complete: () => {
        this.blockUI.stop();
      }
    });

  }

  printInvoice(id: any, ref_banco: any, bandera: null) {
    console.warn('params', id, ref_banco, bandera)
    this.blockUI.start('Descargando su recibo...');
    if (bandera == null) {
      this._ps.printReceipt(id, ref_banco)
        .subscribe((response: BlobPart) => {

          const file = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
          this.blockUI.stop();

        },
          (error: { message: any; }) => {

            this.blockUI.stop();
            Swal.fire({
              title: 'ERROR!!!',
              text: error.message,
              icon: 'error'
            });
          });
    } else {
      this._ps.printReceiptDsto(id, ref_banco).subscribe((response: BlobPart) => {

        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.blockUI.stop();
      },
        (error: { error: { message: any; }; }) => {
          this.blockUI.stop();

          Swal.fire({
            title: 'ERROR!!!',
            text: error.error.message,
            icon: 'error'
          });
        });
    }
  }

  generarCartaNoAdeudo(id: string, ref: string) {

    this.blockUI.start("Generando...")
    this._ps.getCartaNoAdeudo(id, ref).subscribe(resp => {
      this.blockUI.stop();
      let blob = new Blob([resp], { type: resp.type });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    }, error => {
      this.blockUI.stop();

      Swal.fire({
        title: 'AVISO!!', text: "Error al cargar carta, inténtelo de nuevo", icon: 'error'
      });
    });
  }

}
