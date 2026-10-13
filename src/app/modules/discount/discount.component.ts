import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DescuentosService } from '../../services/dashboard/descuentos/descuentos.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Descuentos } from '../../services/dashboard/descuentos/descuentos';
import { Router } from '@angular/router';
import { EvoService } from '../../services/dashboard/evo.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Carrito, DetPagoOnlineDTO, PagoOnline, PagoOnlineDTO } from '../shoppingcart/shoppingcart.model';

declare const Checkout: any

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss', '../../../assets/css/login.css']
})
export class DiscountComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI!: NgBlockUI;
  det: any[] = [];
  descuentos!: Descuentos[];
  descuentosdet!: Descuentos[];
  public items: any = "";
  forma: FormGroup = new FormGroup({});
  total = 0;
  constructor(private _ds: DescuentosService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    public router: Router,
    private _evo: EvoService
  ) {

    (window as any).errorCallback = (error: any) => {
      console.error('EVO error:', error);
      if (error.explanation.includes('expired')) {

      }
    };
    (window as any).cancelCallback = () => {
     
    };
    (window as any).completeCallback = (resultIndicator: string, sessionVersion: string) => {
     
      const referencia = sessionStorage.getItem('MasterID');
  
      this._evo.handleCompletado(resultIndicator['resultIndicator'], resultIndicator['sessionVersion'], referencia)
    };

  }
  ngOnDestroy(): void {
    //this.stopPolling();
    delete (window as any).errorCallback;
    delete (window as any).cancelCallback;
    delete (window as any).completeCallback;
  }
  prepararEvo(): void {
    const scriptUrl =
      'https://evopaymentsmexico.gateway.mastercard.com/static/checkout/checkout.min.js';

    const existente = Array.from(document.scripts)
      .find(script => script.src === scriptUrl);

    if (existente) {
      
      return;
    } else {
    
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

    window.scroll(0, 0);
    this.crearFormulario();

    this._ds.getDescuento().subscribe(
      (descuentos) => {
        this.descuentos = descuentos
        
      }
    )

  }

  valuesSelect(value: number) {
    
    this.forma.get('pago_foldescto')!.setValue(value);
    this._ds.getDescuentoDet(value).subscribe(
      (responseDETALLE) => {
        this.descuentosdet = responseDETALLE
        
        this.totalPrice(this.descuentosdet);
        this.det=[];
        for (var i = 0; i < this.descuentosdet.length; i++) {
          const descuento: Descuentos = this.descuentosdet[i];
          const rowDetalle: Carrito = {
            dpago_idingreso: descuento.vdes_id,
            dpago_cantidad: descuento.vdes_cantidad,
            dpago_punit: descuento.vdes_punit,
            regidescto: descuento.vdes_regid,
            descto: descuento.vdes_porc,
            dto_pagar: descuento.vdes_a_pagar,
            Mount: descuento.vdes_a_pagar,
            Descrip: descuento.vdes_concepto,
            paquete:null
          }
          console.warn('test', rowDetalle)
          this.det.push(rowDetalle)
        }

      }
    )
  }

  totalPrice(datosdet: any) {
    this.total = 0;
    for (let data of datosdet) {
      this.total += parseFloat(data.vdes_a_pagar);
    }
    this.forma.get('pago_montoapagar')!.setValue(this.total);
    return this.total;
  }

  get conceptoNovalido() {
    return this.forma.get('pago_concepto')!.invalid && this.forma.get('pago_concepto')!.touched
  }

  get metodoPagoNovalido() {
    return this.forma.get('metodoPago')!.invalid && this.forma.get('metodoPago')!.touched
  }

  getdescuentosNovalido() {
    return this.forma.get('descuentos')!.invalid && this.forma.get('descuentos')!.touched
  }

  crearFormulario() {

    this.forma = this.fb.group({
     // descuentos: ['', Validators.required],
      pago_concepto: ['', [Validators.required, Validators.maxLength(150)]],
      pago_foldescto: [null,Validators.required],
      pago_referencia: [sessionStorage.MasterID],
      pago_montoapagar: [''],
      pago_usuaid: [sessionStorage.getItem('usuID')],
      pago_estatus: ['P']
    });
  }

  generarEntidad(): any {

    const pagoOnline: PagoOnline = (this.forma.getRawValue() as PagoOnline);

    const detalle: Array<DetPagoOnlineDTO> = this.det.map((e: Carrito) => {
      return {
        idingreso: e.dpago_idingreso,
        cantidad: e.dpago_cantidad,
        punit: e.dpago_punit,
        descto: e.descto,
        dtoPagar: e.dto_pagar,
        regidescto: e.regidescto
      }
    });
    const entity: PagoOnlineDTO = {
      usuaid: pagoOnline.pago_usuaid,
      concepto: pagoOnline.pago_concepto,
      montoapagar: pagoOnline.pago_montoapagar,
      user: pagoOnline.pago_usuaid,
      detalle: detalle,
      foldescto: pagoOnline.pago_foldescto,
      referencia: this.pago_referencia.value
    }
    console.info('pagoOnline', pagoOnline)
    console.info('detalle', detalle)
    console.warn('entity', entity)
    return entity;
  }


  Pagar() {
    this.blockUI.start();
    
    if (this.forma.invalid) {
      this.blockUI.stop();
      alert('Faltan campos por completar');
      return Object.values(this.forma.controls).forEach(control => {
        control.markAsTouched();

      })

      return;
    } else {
      //*** esto lo nuevo */
      const entity = this.generarEntidad();
      console.warn('forma', this.forma.getRawValue())
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
      //this.mostrarEvo(this.total, entity)
    }

  }
  get pago_referencia() {
    return this.forma.get('pago_referencia') as FormControl;
  }

  public closeEvoModal(event: Event): void {
    this._evo.closeEvoModal(event,this.pago_referencia.value);
  }
  private showEvoOverlay(): void {
    this._evo.showEvoOverlay();
  }
}
