import { Component, OnInit } from '@angular/core';
import { DescuentosService } from '../../services/dashboard/descuentos/descuentos.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { PagoServiciosService } from '../../services/dashboard/pagoServicios/pagoservicios.service';
import { Subscription } from 'rxjs';
import { Descuentos } from '../../services/dashboard/descuentos/descuentos';
import { Router } from '@angular/router';
import { EvoService } from '../../services/dashboard/evo.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PagoOnline, DetPagoOnlineDTO, Carrito, PagoOnlineDTO } from '../shoppingcart/shoppingcart.component';

declare const Checkout: any

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  det: any[] = [];

  public Checkout() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = "Checkout.configure({" +
      "merchant: '1143891'," +
      //"merchant: '1143891',"+
      "order: {description: 'Pago de servicios',amount: '" + this.forma.get('pago_montoapagar')!.value + "',currency: 'MXN',id: '" + this.ID + "'}," +
      "interaction: {merchant: {name: 'UJED',address: {line1: 'Calle Constitución 404, Zona Centro, 34100 Durango, Dgo.'}}," +
      "displayControl : {billingAddress : 'HIDE'},}," +
      "session: {id:  '" + this.session_id + "'}," +
      "});";
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  private subscription!: Subscription;

  descuentos!: Descuentos[];
  descuentosdet!: Descuentos[];

  session_id!: string;
  successIndicator!: string;
  ID!: string;

  public items: any = "";

  forma!: FormGroup;

  total = 0;

  constructor(private _ds: DescuentosService, private fb: FormBuilder, private _ps: PagoServiciosService,
    public router: Router, private _evo: EvoService) { }

  ngOnInit() {

    this.subscription = this._ps.getTsqpagosonline()
      .subscribe((data: any) => {
        this.ID = data;
        //console.log(data);
      })

    window.scroll(0, 0);
    this.crearFormulario();

    this._ds.getDescuento().subscribe(
      (descuentos) => {
        this.descuentos = descuentos
        //console.log(descuentos);
      }
    )

  }

  valuesSelect(values: any) {
    //console.log(values);
    this.forma.get('pago_foldescto')!.setValue(values);
    this._ds.getDescuentoDet(values).subscribe(
      (descuentosdet) => {
        this.descuentosdet = descuentosdet
        console.log(descuentosdet);
        this.totalPrice(this.descuentosdet);

        for (var i = 0; i < this.descuentosdet.length; i++) {
           const descuento:Descuentos=this.descuentosdet[i];
           const rowDetalle:Carrito = {
            dpago_idingreso: descuento.vdes_id,
            dpago_cantidad: descuento.vdes_cantidad,
            dpago_punit: descuento.vdes_punit,
            regidescto:descuento.vdes_regid,
            descto:descuento.vdes_porc,
            dto_pagar:descuento.vdes_a_pagar,
            Mount:descuento.vdes_a_pagar,
            Descrip:descuento.vdes_concepto
          }
        this.det.push(rowDetalle)
        }
        //console.log(this.det);

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
      descuentos: ['', Validators.required],
      pago_concepto: ['', [Validators.required, Validators.maxLength(150)]],
      pago_foldescto: [''],
      pago_referencia: [this.ID],
      pago_montoapagar: [''],
      pago_usuaid: [sessionStorage.getItem('usuID')],
      metodoPago: ['', Validators.required],
      pago_estatus: ['P']
    });
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


  Pagar() {
    this.blockUI.start();
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach(control => {
        control.markAsTouched();
        this.blockUI.stop();
      })
    } else {
      console.log(this.forma);

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


     
    }

  }
}
