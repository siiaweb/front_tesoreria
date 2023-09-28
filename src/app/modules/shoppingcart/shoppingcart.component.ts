import { Component, OnInit } from '@angular/core';
import { EvoService } from '../../services/dashboard/evo.service';
import { PagoServiciosService } from '../../services/dashboard/pagoServicios/pagoservicios.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/Rx'; 
import { promise } from 'protractor';
import{TdpagosOnline} from 'src/app/services/dashboard/pagoServicios/tdpagosonline';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare const Checkout,showLightbox:any

@Component({
  selector: 'app-shoppingcart',
  templateUrl: './shoppingcart.component.html',
  styleUrls: ['./shoppingcart.component.scss']
})
export class ShoppingcartComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public pagodet: TdpagosOnline = new TdpagosOnline();
  valores:  String;
  det: any[] = [];
  importe=0;
  /*
  public loadScript() {
    let body = <HTMLDivElement> document.body;
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = '';
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@9";
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
  */

  public cancelCallbackScript() {
    let body = <HTMLDivElement> document.body;
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = "function cancelCallback() {"+
                       " console.log('Payment cancelled');}";
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  public errorCallbackScript() {
    let body = <HTMLDivElement> document.body;
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = "function errorCallback(error) {"+
                       " console.log(JSON.stringify(error));}";
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  public completeCallbackScript() {
    let body = <HTMLDivElement> document.body;
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = "function completeCallback(resultIndicator, sessionVersion) {"+
                       " console.log('resultIndicator: ' +resultIndicator);"+
                       " console.log('sessionVersion:' +sessionVersion);"+
                       " Swal.fire({icon: 'success',title: 'Pago exitoso!!!',text: 'Puedes descargar tu pago en la sección de recibos',showConfirmButton: false,timer: 1500});}";
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  public Checkout() {
    let body = <HTMLDivElement> document.body;
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = "Checkout.configure({"+
      //"merchant: 'TEST1143891',"+
      "merchant: '1143891',"+
        "order: {description: 'Pago de servicios',amount: '"+this.forma.get('pago_montoapagar').value+"',currency: 'MXN',id: '"+this.ID+"'},"+
        "interaction: {merchant: {name: 'UJED',address: {line1: 'Calle Constitución 404, Zona Centro, 34100 Durango, Dgo.'}},"+
            "displayControl : {billingAddress : 'HIDE'},},"+
		    "session: {id:  '"+this.session_id+"'},"+
      "});";
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  forma: FormGroup;

  private subscription: Subscription;

  ecomServices: any[];

  session_id:string;
  successIndicator:string;
  ID:string;
  total = 0;

  constructor( private _evo: EvoService, private _ps: PagoServiciosService, private fb: FormBuilder,
               public router: Router ) { }

  ngOnInit() {

    this.subscription = this._ps.getTsqpagosonline()
      .subscribe((data: any) => {
        this.ID = data;
        //console.log(data);
        })	

    this.cancelCallbackScript();
    this.errorCallbackScript();

    this.ecomServices = JSON.parse(sessionStorage.getItem('shoppingCart'));
  
    this.totalPrice();
    
    this.crearFormulario();
  
    //console.log(sessionStorage.getItem('shoppingCart'));
    var items = JSON.parse(sessionStorage.getItem('shoppingCart'));
    for (var i=0;i<items.length;i++){
      //console.log(items[i]);
      //this.det.push(items[i].dpago_idingreso+'_'+items[i].Descrip+'_'+items[i].dpago_cantidad+'_'+items[i].dpago_punit+'_null');
      this.det.push(items[i].dpago_idingreso+'_'+items[i].dpago_cantidad+'_'+items[i].dpago_punit+'_null');
    }
    
  }

  get conceptoNovalido(){
    return this.forma.get('pago_concepto').invalid && this.forma.get('pago_concepto').touched
  }

  get metodoPagoNovalido(){
    return this.forma.get('metodoPago').invalid && this.forma.get('metodoPago').touched
  }

  crearFormulario(){
  
    this.forma = this.fb.group({
      pago_concepto: ['', [Validators.required,Validators.maxLength(150)]],
      metodoPago: ['', Validators.required],
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
    for(let data of this.ecomServices){
      this.total += parseFloat(data.Mount);
    }
    return this.total;
  }

  deleteItem(dpago_idingreso){
    //console.log("ID: "+dpago_idingreso);
    var items = JSON.parse(sessionStorage.getItem('shoppingCart'));
   //console.log(items);
    for (var i=0;i<items.length;i++){
      if (items[i].dpago_idingreso == dpago_idingreso){
        items.splice(i,1);
        sessionStorage["shoppingCart"] = JSON.stringify(items);
        this.ecomServices = JSON.parse(sessionStorage.getItem('shoppingCart'));
      }
    }
    //console.log(items);
    //console.log(this.det);

    //console.log(this.det);
  this.totalPrice();
  this.crearFormulario();
  }

  deleteArray(dpago_idingreso){
    for (var i=0;i<this.det.length;i++){
      var splitted = this.det[i].split('-'); 
      if(splitted[0]==dpago_idingreso){
        this.det.splice(i,1);
      }
      }
  }
 

  Pagar(){
    this.blockUI.start();
    //console.log(this.forma);
    if (this.forma.invalid){
      return Object.values( this.forma.controls ).forEach( control =>{
        control.markAsTouched();
        this.blockUI.stop();
      })
    }else{
      this._ps.create(this.forma.value).subscribe(master => {

         this._ps.createDetalle(master.pago_folpago.toString(),this.det).subscribe(detalle =>{
          this.blockUI.stop();
          Swal.fire({icon: 'success',title: 'Datos Guardados',text: 'Se te redireccionara al portal de pago',showConfirmButton: false,timer: 3000});
          sessionStorage.removeItem('shoppingCart');
          //this._evo.getEvo(this.ID,master.pago_montoapagar).subscribe(
            this._evo.getEvo(this.ID,this.total).subscribe(
            (variables) => {
              this.session_id = variables.session_id;
              this.successIndicator = variables.successIndicator;
              this.router.navigate(['/dashboard']);
                     
              return new Promise(resolve => {
                this.Checkout();
                Checkout.showLightbox();
                resolve(
                  sessionStorage.MasterID = master.pago_referencia.toString()
                );
              })
            }
          )

         },
         error => {
           console.log(error);
           this.blockUI.stop();
           Swal.fire({
             title: 'ERROR!!!',
             text: error.error.message,
             icon: 'error'});
         });

      },
      error => {
        console.log(error);
        this.blockUI.stop();
        Swal.fire({
          title: 'ERROR!!!',
          text: error.error.message,
          icon: 'error'});
      })
    }
   
  }


}
