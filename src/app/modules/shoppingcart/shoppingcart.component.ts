import { Component, OnInit } from '@angular/core';
import { EvoService } from '../../services/dashboard/evo.service';
import { PagoServiciosService } from '../../services/dashboard/pagoServicios/pagoservicios.service';
import { Subscription } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TdpagosOnline } from 'src/app/services/dashboard/pagoServicios/tdpagosonline';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgZone } from '@angular/core';

export interface Carrito {
  Descrip: string;
  Mount: number;
  dpago_cantidad: number;
  dpago_idingreso: string;
  dpago_punit: number;
}

export interface PagoOnline {
  metodoPago: string;
  pago_concepto: string;
  pago_estatus?: string;
  pago_montoapagar: number;
  pago_referencia?: string;
  pago_usuaid: string;
}

export interface PagoOnlineDTO{
  usuaid:string;
  concepto:string;
  montoapagar:number;
  //referencia?:string;
  user:string;
  foldescto?:number;
  detalle:Array<DetPagoOnlineDTO>
}

export interface DetPagoOnlineDTO{
  idingreso:string;
  cantidad:number;
  punit:number;
  descto?:number;
  dto_pagar?:number;
  regidescto?:number;
}

declare var Checkout: any;

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
  //ID!: string;
  total = 0;

  /*
    private Long folpago;
    private String usuaid;
    private String concepto;
    private BigDecimal montoapagar;
    private String referencia;
    private String user;
    private String estatus;
    private Long foldescto;
    private LocalDateTime fpago;
    List<TdpagosOnlineDTO> detalle = new ArrayList<>();
    -----
        private String idingreso;
    private int cantidad;
    private BigDecimal punit;
    private BigDecimal descto;
    private BigDecimal dto_pagar;
    private Long regidescto;
    */

  constructor(private _evo: EvoService, private _ps: PagoServiciosService, private fb: FormBuilder,
    public router: Router, private ngZone: NgZone) { }

  ngOnInit() {

    const shoppingCart = sessionStorage.getItem('shoppingCart');

    this.ecomServices = shoppingCart
      ? (JSON.parse(shoppingCart) as Carrito[]).map((e: Carrito) => {
        return { ...e, Mount: e.dpago_cantidad * e.dpago_punit }
      })
      : [];
    //this.ecomServices = this.ecomServices
    console.warn(this.ecomServices)
    this.totalPrice();

    this.crearFormulario();

    //console.log(sessionStorage.getItem('shoppingCart'));
    const items = JSON.parse(sessionStorage.getItem('shoppingCart')!);
    if (items) {
      for (var i = 0; i < items.length; i++) {
        const rowDetalle = {
          dpago_idingreso: items[i].dpago_idingreso,
          dpago_cantidad: items[i].dpago_cantidad,
          dpago_punit: items[i].dpago_punit
        }
        this.det.push(rowDetalle)
        //this.det.push(items[i].dpago_idingreso + '_' + items[i].dpago_cantidad + '_' + items[i].dpago_punit + '_null');
      }
    }


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
      metodoPago: ['', Validators.required],
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
  }

  totalPrice() {
    console.info('total price')
    this.total = 0;
    if (!this.ecomServices) {
      return 0
    }
    console.warn(this.ecomServices)
    for (let data of this.ecomServices) {

      this.total += parseFloat(data.Mount);
    }
    return this.total;
  }

  deleteItem(dpago_idingreso: any) {
    /* //console.log("ID: "+dpago_idingreso);
     var items: Array<any> = JSON.parse(sessionStorage.getItem('shoppingCart')!);
     //console.log(items);
     if (!items) {
       return;
     }
     for (var i = 0; i < items.length; i++) {
       if (items[i].dpago_idingreso == dpago_idingreso) {
         items.splice(i, 1);
         sessionStorage["shoppingCart"] = JSON.stringify(items);
         this.ecomServices = JSON.parse(sessionStorage.getItem('shoppingCart')!);
       }
     }
     this.totalPrice();
     this.crearFormulario();*/
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

      const pagoOnline:PagoOnline = (this.forma.getRawValue() as PagoOnline);
      
      const detalle: Array<DetPagoOnlineDTO> = this.det.map((e:Carrito)=>{
        return {
            idingreso:e.dpago_idingreso,
            cantidad:e.dpago_cantidad,
            punit:e.dpago_punit
        }
      });
      const entity:PagoOnlineDTO = { 
        usuaid:pagoOnline.pago_usuaid, 
        concepto:pagoOnline.pago_concepto,
        montoapagar:pagoOnline.pago_montoapagar,
        user:pagoOnline.pago_usuaid,
        detalle: detalle 
      }
      console.info('pagoOnline', pagoOnline)
      console.info('detalle', detalle)
      console.warn('entity',entity)
      this._evo.getEvo(this.total, entity).subscribe({
        next: (response: any) => {
          console.warn('response', response)
          this.session_id = response.session_id;
          this.successIndicator = response.successIndicator;
          //   this.referencia=response.referencia;
          sessionStorage.MasterID = response.referencia.toString();
          this.clearHostedCheckoutSessionStorage();
          const ck = (window as any).Checkout;
          if (ck) {
            ck.configure({
              session: {
                id: this.session_id
              }

            });
            this.showEvoOverlay();
                      setTimeout(() => {
                  try {
                    // pasar height: '100%' no siempre funciona; el contenedor controla la altura
                    const res = ck.showEmbeddedPage('#evo-embed-container');
                    if (res && typeof res.then === 'function') {
                      res.then(() => console.log('showEmbeddedPage completado')).catch((e: any) => {
                        console.error('Error showEmbeddedPage:', e);

                        this.closeEvoModal();
                      });
                    }
                  } catch (e) {
                    console.error('Error invocando showEmbeddedPage:', e);
                    this.closeEvoModal();
                  }
                }, 200); // 200ms es suficiente si el overlay ya está visible
          }
        },
        error: (e) => {
          console.error('e', e)
          Swal.fire({
            title: 'ERROR!!!',
            text: JSON.stringify(e),
            icon: 'error'
          });
        },
        complete: () => {

        }
      })

    }

  }

  private safeJson(value: any): string {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return String(value);
    }
  }
}
