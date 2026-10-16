import { Component, OnInit } from '@angular/core';
import { PagoServiciosService } from '../../services/dashboard/pagoServicios/pagoservicios.service';
import { BlockUI, BlockUIService, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { EvoService } from 'src/app/services/dashboard/evo.service';
import { erroresFormulario } from '../componentes-genericos/manejo-errores-forma/errores';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
  resultIndicator: string | null = null;
  @BlockUI() blockUI!: NgBlockUI;



  recibos: any;
  constructor(
    private _ps: PagoServiciosService,
    private route: ActivatedRoute,
    private _evo: EvoService,
    private blockUIService: BlockUIService,
  ) { }

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
            // console.log('item', item, item.resultIndicator === resultIndicator, item.estatus == 'P')
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
        this._evo.clearHostedCheckoutSessionStorage();
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
        alert('err' + JSON.stringify(error))
        this.blockUIService.stop('global');
        erroresFormulario.handleError(error);
      },
      complete: () => {
        this.blockUI.stop();
      }
    });

  }

  generarRecibo(id: number) {
    this.blockUI.start('generando..')
    this._ps.getRecibo(id).pipe(
    //  filter((event): event is HttpResponse<Blob> => event instanceof HttpResponse)
    ).subscribe({
      next: (response) => {
        this.blockUI.stop();
        const fileURL = URL.createObjectURL(response.body);
        window.open(fileURL, '_blank');
        setTimeout(() => URL.revokeObjectURL(fileURL), 60000);
      //  const fileURL = URL.createObjectURL(blob);
      },
      error: (error) => {
        this.blockUI.stop();
        console.error('error', error)

      },
      complete: () => {
        this.blockUI.stop();
        console.log('complete...')
      }
    })
  }



  generarCartaNoAdeudo(id: string, ref: string) {
    console.log(id);
    this.blockUI.start("Generando...")
    this._ps.getCartaNoAdeudo(id, ref).subscribe(resp => {
      this.blockUI.stop();
      let blob = new Blob([resp], { type: resp.type });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    }, error => {
      this.blockUIService.stop('global');
      erroresFormulario.handleError(error);
    });
  }

}
