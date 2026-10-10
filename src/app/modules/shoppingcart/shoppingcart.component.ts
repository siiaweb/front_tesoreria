import { ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { EvoService } from '../../services/dashboard/evo.service';
import { PagoServiciosService } from '../../services/dashboard/pagoServicios/pagoservicios.service';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TdpagosOnline } from 'src/app/services/dashboard/pagoServicios/tdpagosonline';
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
  styleUrls: ['./shoppingcart.component.scss', '../../../assets/css/login.css']
})
export class ShoppingcartComponent implements OnInit,OnDestroy {
  @BlockUI() blockUI!: NgBlockUI;
  public pagodet: TdpagosOnline = new TdpagosOnline();
  valores!: String;
  det: any[] = [];
  importe = 0;
  forma!: FormGroup;
  private subscription!: Subscription;
  ecomServices!: any[];
  //session_id!: string;
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
      this._evo.handleCompletado(resultIndicator['resultIndicator'], resultIndicator['sessionVersion'], referencia)
    };
    console.log('construido')

  }

  prepararEvo(): void {
    const scriptUrl =
      'https://evopaymentsmexico.gateway.mastercard.com/static/checkout/checkout.min.js';

    const existente = Array.from(document.scripts)
      .find(script => script.src === scriptUrl);

    if (existente) {
      console.log('Checkout.js ya está agregado; no se insertará otra vez.');
      return;
    } else{
      console.log('no existe')
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
      // metodoPago: ['', Validators.required],
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
    this._evo.showEvoOverlay();
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
      const entity = this.generarEntidad();
      console.warn('forma', this.forma.getRawValue())
      this.mostrarEvo(this.total, entity)
    }
  }

  //se agrega en lugar de 



  
    mostrarEvo(total:number,entity:any) {//(this.ID, this.total)
      console.warn('forma', this.forma.getRawValue())
      //let referencia = this.forma.get('referencia').value;
      
      this._evo.getEvo(this.total, entity).subscribe({
        next: (response: any) => {
          this.blockUI.stop();
          console.warn('response', response)
         
     
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
                  this._evo.startPolling(this.pago_referencia.value)
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
        punit: e.dpago_punit,
        descto:null,
        dtoPagar:null,
        regidescto:null,
       
      }
    });
    const entity: PagoOnlineDTO = {
      usuaid: pagoOnline.pago_usuaid,
      concepto: pagoOnline.pago_concepto,
      montoapagar: pagoOnline.pago_montoapagar,
      user: pagoOnline.pago_usuaid,
      detalle: detalle,
      foldescto:null,
       referencia:pagoOnline.pago_referencia
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
