import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { EvoService } from '../../services/dashboard/evo.service';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Carrito, DetPagoOnlineDTO, PagoOnline, PagoOnlineDTO } from './shoppingcart.model';
import Swal from 'sweetalert2';


export interface EvoCheckout {
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
  styleUrls: ['./shoppingcart.component.scss']
})
export class ShoppingcartComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI!: NgBlockUI;
  forma!: FormGroup;
  private subscription!: Subscription;
  ecomServices!: Array<Carrito>;
  total = 0;

  constructor(
    private _evo: EvoService,
    private fb: FormBuilder,
    public router: Router,
    private renderer: Renderer2,
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

      const referencia = sessionStorage.getItem('MasterID');

      this._evo.handleCompletado(resultIndicator['resultIndicator'], resultIndicator['sessionVersion'], referencia)
    };


  }

  prepararEvo(): void {
    const scriptUrl =
      'https://evopaymentsmexico.gateway.mastercard.com/static/checkout/checkout.min.js';

    const existente = Array.from(document.scripts)
      .find(script => script.src === scriptUrl);

    if (existente) {
      console.log('ya existe')
      return;
    } else {
      console.log('else no existente')
    }
    const script = this.renderer.createElement('script') as HTMLScriptElement;
    this.renderer.setAttribute(script, 'src', scriptUrl);
    this.renderer.setAttribute(script, 'data-error', 'errorCallback');
    this.renderer.setAttribute(script, 'data-cancel', 'cancelCallback');
    this.renderer.setAttribute(script, 'data-complete', 'completeCallback');
    script.onerror = () => console.error('Error cargando Checkout.js');
    this.renderer.appendChild(document.head, script);
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
      pago_referencia: [],
      pago_montoapagar: [this.total],
      pago_usuaid: [sessionStorage.getItem('usuID')],
      pago_estatus: ['P']
    });

  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
    this
    // ..stopPolling();
    delete (window as any).errorCallback;
    delete (window as any).cancelCallback;
    delete (window as any).completeCallback;
  }


  totalPrice() {
    this.total = 0;
    if (this.ecomServices) {
      for (let data of this.ecomServices) {
        this.total += data.amount;
      }
    }

    return this.total;
  }

  deleteItem(dpago_idingreso: any) {
    let items = this.ecomServices;

    for (let i = 0; i < items.length; i++) {
      if (items[i].dpago_idingreso == dpago_idingreso) {
        items.splice(i, 1);
      }
    }
    sessionStorage["shoppingCart"] = JSON.stringify(items);
    this.totalPrice();
    this.crearFormulario();
  }


  // Limpieza segura en Angular (poner justo antes de configurar Checkout)
  clearHostedCheckoutSessionStorage() {
    const keys = ['HostedCheckout_sessionId', 'HostedCheckout_embedContainer', 'HostedCheckout_merchantState'];
    keys.forEach(k => {
      if (sessionStorage.getItem(k) !== null) {
        sessionStorage.removeItem(k);
      }
    });
  }


  // Mostrar overlay con clase 'open' y forzar change detection
  private showEvoOverlay(): void {
    this._evo.showEvoOverlay();
  }

  // Cerrar
  public closeEvoModal(event?: Event): void {
    this._evo.closeEvoModal(event, this.pago_referencia.value);
  }



  async Pagar() {
    console.log('pagando')
    this.blockUI.start();

    if (this.forma.invalid) {
      alert('Faltan campos por capturar');
      return Object.values(this.forma.controls).forEach(control => {
        control.markAsTouched();
        this.blockUI.stop();
      })
    } else {
      /**/
      const items:Array<any> = this.ecomServices;
      const entity = this.generarEntidad();
      console.warn('forma', this.forma.getRawValue())
      //this.mostrarEvo(this.total, entity)
      this._evo.mostrarEvo(this.total, entity).subscribe({
        next: (r) => {

          this.pago_referencia.setValue(r.referencia);
          this.blockUI.stop();
        },
        error: (e) => {
          if (sessionStorage.MasterID) {
            this.pago_referencia.setValue(sessionStorage.MasterID);
          }
          this.blockUI.stop();
          console.error('e.getEvo', e)
          Swal.fire({
            title: 'ERROR!!!',
            text: JSON.stringify(e),
            icon: 'error'
          });
        },
        complete: () => {

          this.blockUI.stop();
        }
      });

    }
  }


  generarEntidad(): any {

    const pagoOnline: PagoOnline = (this.forma.getRawValue() as PagoOnline);

    const detalle: Array<DetPagoOnlineDTO> = this.ecomServices.map((e: Carrito) => {
      return {
        idingreso: e.dpago_idingreso,
        cantidad: e.dpago_cantidad,
        punit: e.dpago_punit,
        descto: null,
        dtoPagar: null,
        regidescto: null,
        paquete: e.paquete
      }
    });
    const entity: PagoOnlineDTO = {
      usuaid: pagoOnline.pago_usuaid,
      concepto: pagoOnline.pago_concepto,
      montoapagar: pagoOnline.pago_montoapagar,
      user: pagoOnline.pago_usuaid,
      detalle: detalle,
      foldescto: null,
      referencia: pagoOnline.pago_referencia
    }
    console.info('pagoOnline', pagoOnline)
    console.info('detalle', detalle)
    console.warn('entity', entity)
    return entity;
  }



  get pago_referencia() {
    return this.forma.get('pago_referencia') as FormControl;
  }
  //



}
