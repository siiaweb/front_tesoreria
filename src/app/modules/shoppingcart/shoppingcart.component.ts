import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { EvoService } from '../../services/dashboard/evo.service';
import { PagoServiciosService } from '../../services/dashboard/pagoServicios/pagoservicios.service';
import { EMPTY, interval, Subscription, timer } from 'rxjs';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TdpagosOnline } from 'src/app/services/dashboard/pagoServicios/tdpagosonline';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgZone } from '@angular/core';
import { Carrito, DetPagoOnlineDTO, PagoOnline, PagoOnlineDTO } from './shoppingcart.model';
import { startWith, switchMap, catchError, takeUntil } from 'rxjs/operators';


interface EvoCheckout {
  configure(options: {
    session: {
      id: string;
    };
  }): void;

  showPaymentPage(): void;
  showEmbeddedPage(selector: string): void;
  showLightbox(): void;
}


//declare var Checkout: any;

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.scss', '../../../assets/css/login.css']
})
export class ShoppingcartComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  public pagodet: TdpagosOnline = new TdpagosOnline();
  valores!: String;
  det: any[] = [];
  importe = 0;
  forma!: FormGroup;
  private subscription!: Subscription;
  ecomServices!: any[];
  session_id!: string;
  successIndicator!: string;
  ID!: string;
  total = 0;

  constructor(
    private _evo: EvoService,
    private _ps: PagoServiciosService,
    private fb: FormBuilder,
    public router: Router,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
  ) {

    (window as any).errorCallback = (error: any) => {
      console.log('EVO error:', error);
      if (error.explanation.includes('expired')) {

      }
    };
    (window as any).cancelCallback = () => {
      console.log('EVO cancelado');
    };
    (window as any).completeCallback = (resultIndicator: string, sessionVersion: string) => {
      console.log('EVO complete');
      const referencia = sessionStorage.getItem('MasterID');
      console.log('resultIndicator:', resultIndicator);
      console.log('sessionVersion:', sessionVersion);
      console.log('referencia:', referencia);
      this.handleCompletado(resultIndicator['resultIndicator'], resultIndicator['sessionVersion'], referencia)
    };
    console.log('construido')

  }

  ngOnInit() {
    this.prepararEvo();
    this.ecomServices = JSON.parse(sessionStorage.getItem('shoppingCart')!);
    this.totalPrice();
    this.crearFormulario();
  }

  get conceptoNovalido() {
    return this.forma.get('pago_concepto')!.invalid && this.forma.get('pago_concepto')!.touched
  }

  get metodoPagoNovalido() {
    return this.forma.get('metodoPago')!.invalid && this.forma.get('metodoPago')!.touched
  }

  crearFormulario() {

    this.forma = this.fb.group({
      pago_concepto: ['', [Validators.required, Validators.maxLength(150)]],
     // metodoPago: ['', Validators.required],
      pago_referencia: [this.ID],
      pago_montoapagar: [this.total],
      pago_usuaid: [sessionStorage.getItem('usuID')],
      pago_estatus: ['P']
    });

  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  totalPrice() {
    this.total = 0;
    for (let data of this.ecomServices) {
      this.total += parseFloat(data.Mount);
    }
    return this.total;
  }

  deleteItem(dpago_idingreso: any) {
    let items = this.ecomServices;
    console.log('item', items);
    for (let i = 0; i < items.length; i++) {
      if (items[i].dpago_idingreso == dpago_idingreso) {
        items.splice(i, 1);
      }
    }
    sessionStorage["shoppingCart"] = JSON.stringify(items);
    this.totalPrice();
    this.crearFormulario();
  }

  deleteArray(dpago_idingreso: any) {
    for (var i = 0; i < this.det.length; i++) {
      var splitted = this.det[i].split('-');
      if (splitted[0] == dpago_idingreso) {
        this.det.splice(i, 1);
      }
    }
  }


  // Limpieza segura en Angular (poner justo antes de configurar Checkout)
  clearHostedCheckoutSessionStorage() {
    const keys = ['HostedCheckout_sessionId', 'HostedCheckout_embedContainer', 'HostedCheckout_merchantState'];
    keys.forEach(k => {
      if (sessionStorage.getItem(k) !== null) {
        console.log('Borrando sessionStorage key:', k);
        sessionStorage.removeItem(k);
      }
    });
  }


  // Mostrar overlay con clase 'open' y forzar change detection
  private showEvoOverlay(): void {
    const overlay = document.getElementById('evo-embed-overlay') as HTMLElement;
    if (!overlay) { console.error('Overlay no encontrado'); return; }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // forzar reflow para evitar problemas de stacking
    void overlay.offsetHeight;
  }

  // Cerrar
  public closeEvoModal(event?: Event): void {
    if (event) event.stopPropagation();
    const overlay = document.getElementById('evo-embed-overlay') as HTMLElement;
    if (overlay) overlay.classList.remove('open');
    const container = document.getElementById('evo-embed-container');
    if (container) container.innerHTML = '';
    document.body.style.overflow = '';
    this.clearHostedCheckoutSessionStorage();
  }



  async Pagar() {
    this.blockUI.start();
    //console.log(this.forma);
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach(control => {
        control.markAsTouched();
        this.blockUI.stop();
      })
    } else {
      /**/
      const items = this.ecomServices;
      console.log('items', items)
      this.det = [];
      for (var i = 0; i < items.length; i++) {
        const rowDetalle = {
          dpago_idingreso: items[i].dpago_idingreso,
          dpago_cantidad: items[i].dpago_cantidad,
          dpago_punit: items[i].dpago_punit
        }
        this.det.push(rowDetalle);
      }

      console.log('test', this.det)
      this.mostrarEvo();

    }
  }

  //se agrega en lugar de 
  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

  private pollingSubscription?: Subscription;

  private startPolling(referencia: string): void {
    this.stopPolling();
    this.pollingSubscription = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this._evo.retrieveInfo(referencia).pipe(
            catchError(error => {
              console.error('Error consultando la transacción; se volverá a intentar:', error);
              return EMPTY;
            })
          )
        ),
        takeUntil(timer(10 * 60 * 1000))
      )
      .subscribe({
        next: (response: any) => {
          console.log('Estado de la transacción:', response);

          // Sustituye esta condición por el campo/estados que devuelve tu API.
          if (response && this.transaccionTerminada(response)) {
            //sessionStorage.removeItem("MasterID");
            // sessionStorage.removeItem("shoppingCart");
            this.stopPolling();
          }
        },
        error: (error) => {
          console.error('Error consultando la transacción:', error);
          this.stopPolling();
        }
      });
  }

  mostrarEvo() {//(this.ID, this.total)
    console.warn('forma', this.forma.getRawValue())
    //let referencia = this.forma.get('referencia').value;
    const entity = this.generarEntidad();
    this._evo.getEvo(this.total, entity).subscribe({
      next: (response: any) => {
        this.blockUI.stop();
        console.warn('response', response)
        this.session_id = response.session_id;
        this.successIndicator = response.successIndicator;
        sessionStorage.MasterID = response.referencia;
        this.pago_referencia.setValue(response.referencia);
        this.showEvoOverlay();
        setTimeout(() => {
          try {
            const checkout: EvoCheckout | any = (window as any).Checkout;
            if (!checkout) {
              throw new Error('El SDK de Checkout no está cargado.');
            }
            checkout.configure({
              session: {
                id: response.session_id
              },
            });
            setTimeout(() => {
              //checkout.showPaymentPage();
              // checkout.showLightbox();
              if (checkout) {
                this.startPolling(this.pago_referencia.value)
                checkout.showEmbeddedPage('#evo-embed-container');
              }
              //checkout.showEmbeddedPage('#evo-embed-container');
            }, 700);

            console.log(checkout);
          } catch (e) {
            console.error('Error invocando showEmbeddedPage:', e);
            Swal.fire({ title: 'AVISO!!!', text: JSON.stringify(e), icon: 'error' });
            this.closeEvoModal();
          }
        }, 2000); // 200ms es suficiente si el overlay ya está visible

      },
      error: (e) => {
        this.blockUI.stop();
        console.error('e.getEvo', e)
        Swal.fire({
          title: 'ERROR!!!',
          text: JSON.stringify(e),
          icon: 'error'
        });
      },
      complete: () => {
        console.log('complete')
        this.blockUI.stop();
      }
    })
  }

  generarEntidad(): any {

    const pagoOnline: PagoOnline = (this.forma.getRawValue() as PagoOnline);

    const detalle: Array<DetPagoOnlineDTO> = this.det.map((e: Carrito) => {
      return {
        idingreso: e.dpago_idingreso,
        cantidad: e.dpago_cantidad,
        punit: e.dpago_punit
      }
    });
    const entity: PagoOnlineDTO = {
      usuaid: pagoOnline.pago_usuaid,
      concepto: pagoOnline.pago_concepto,
      montoapagar: pagoOnline.pago_montoapagar,
      user: pagoOnline.pago_usuaid,
      detalle: detalle
    }
    console.info('pagoOnline', pagoOnline)
    console.info('detalle', detalle)
    console.warn('entity', entity)
    return entity;
  }

  private transaccionTerminada(response: any): boolean {
    return response.status === 'CAPTURED';
  }
  handleCompletado(resultIndicator: string, sessionVersion: string, referencia: string) {
    this.stopPolling();
    console.log('Pago completado con éxito:', resultIndicator);
    console.log('sessionVersion', sessionVersion)
    console.log('referencia', referencia)
    //alert('pago completado ' + referencia)
    this._evo.insertarRespuestaConPdf(referencia, resultIndicator)
      .subscribe({
        next: (response) => {
          const disposition = response.headers.get('Content-Disposition');
          console.log('Content-Disposition recibido:', response.headers.get('Content-Disposition'));
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
          const blob = new Blob([response.body], { type: 'application/pdf' });
          if (!blob) {
            console.error('La respuesta no contiene el PDF.');
            return;
          }



          const url = URL.createObjectURL(blob);
          const enlace = document.createElement('a');
          enlace.href = url;
          enlace.download = decodeURIComponent(nombre);
          document.body.appendChild(enlace);
          enlace.click();
          enlace.remove();

          setTimeout(() => URL.revokeObjectURL(url), 1000);
          this.closeEvoModal();

          this.router.navigate(['/recibos'], {
            queryParams: { resultIndicator, sessionVersion }
          }).then(navigated => {
            console.log('Navegación completada:', navigated);
           // this.cdr.detectChanges();
           if(navigated){
            window.location.reload();
           }
          }).catch(error => {
            console.error('Error de navegación:', error);
          });
          console.log('response success', blob)

        },
        error: (e) => {
          console.error('e.handleComplete', e)
        },
        complete: () => {
          console.log('complete handlecomplete')
        }
      })
    // Tu lógica para validar el pago contra tu backend usando el resultIndicator
  }
  get pago_referencia() {
    return this.forma.get('pago_referencia') as FormControl;
  }
  //

  prepararEvo(): void {
    const scriptUrl =
      'https://evopaymentsmexico.gateway.mastercard.com/static/checkout/checkout.min.js';

    const existente = Array.from(document.scripts)
      .find(script => script.src === scriptUrl);

    if (existente) {
      console.log('Checkout.js ya está agregado; no se insertará otra vez.');
      return;
    }

    const script = this.renderer.createElement('script') as HTMLScriptElement;

    this.renderer.setAttribute(script, 'src', scriptUrl);
    this.renderer.setAttribute(script, 'data-error', 'errorCallback');
    this.renderer.setAttribute(script, 'data-cancel', 'cancelCallback');
    this.renderer.setAttribute(script, 'data-complete', 'completeCallback');

    script.onerror = () => console.error('Error cargando Checkout.js');

    this.renderer.appendChild(document.head, script);
  }

}
