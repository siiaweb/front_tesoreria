import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { RecepcionRecibosService, PagoServiciosService } from '../../services/services.index';
import { Tvreciboalumno } from '../../services/dashboard/recepciorecibos/tvreciboalumno';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-recepcion-recibos',
  templateUrl: './recepcion-recibos.component.html',
  styleUrls: ['./recepcion-recibos.component.scss']
})
export class RecepcionRecibosComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  forma: FormGroup;
  formb: FormGroup;
  private subscription: Subscription;

  tvreciboalumno: Tvreciboalumno[];

  public nombre: string;
  public fecha: Date;
  public ures: string;

  public FolPAgo: Number;
  public FolReferencia: Number;
  public FolDescto: Number;

  constructor( private fb: FormBuilder, private _rr: RecepcionRecibosService, public router: Router,
               private _ps: PagoServiciosService ) { }

  ngOnInit() {
    this.crearFormulario();
  }

  buscaRecibo(){
    this.subscription = this._rr.getRecibo(this.forma.get('IDRecibo').value)
    .subscribe((tvreciboalumno) => {
      this.crearFormDetalle();
      this.tvreciboalumno = tvreciboalumno;
      if (tvreciboalumno.length > 0){
        this.nombre = tvreciboalumno[0].nombre_usuario;
        this.fecha = tvreciboalumno[0].fecha;
        this.ures = tvreciboalumno[0].unidad_academica;

        this.FolPAgo= tvreciboalumno[0].folio;
        this.FolReferencia= tvreciboalumno[0].referencia_banco;
        this.FolDescto= tvreciboalumno[0].folio_descto;
      }else{
        Swal.fire({
          title: 'Advertencía!!!',
          text: "El número de recibo "+this.forma.get('IDRecibo').value+ " no existe, o aun no se ha aplicado su pago.",
          icon: 'warning'});
      }

     
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

  get IDReciboNovalido(){
    return this.forma.get('IDRecibo').invalid && this.forma.get('IDRecibo').touched
  }

  crearFormulario(){
  
    this.forma = this.fb.group({
      IDRecibo: ['', Validators.required]
    });

  } 

  crearFormDetalle(){
  
    this.formb = this.fb.group({
      pago_comentarios: ['', Validators.required],
      pago_user_recepcion: [sessionStorage.getItem('Login'), Validators.required]
    });

  } 

  Guardar(Comentario, Concepto, Folio, FolioDet){
    console.log(Comentario);
    
    Comentario = Comentario.trim();
    if (Comentario.trim() == "" || Comentario.trim() == null){
      Swal.fire({
        title: 'Advertencía',
        text: 'Debes agregar un comentario al concepto ' + Concepto,
        icon: 'warning'});
    }else{


      Swal.fire({
        title: 'Confirmación!!!',
        text: "Esta seguro guardar un comentario al concepto "+Concepto+", esta acción ya no podra deshacerse.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar comentario'
      }).then((result) => {
        if (result.isConfirmed) {
          this.blockUI.start();
          this._rr.update(Folio, FolioDet, this.formb.value).subscribe(master => {
            this.blockUI.stop();
            this.router.navigate(['/recepcionrecibos']);
            this.buscaRecibo();
            Swal.fire({icon: 'success',title: 'Registro guardado',showConfirmButton: false,timer: 3000});
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
      })

    }
  }

  printInvoice(id,ref_banco,bandera) {
    this.blockUI.start('Descargando recibo...');
    if (bandera==null){
      this._ps.printReceipt(id,ref_banco).subscribe((response) => {

            const file = new Blob([response], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            this.blockUI.stop();
        
      },
      error => {
        console.log(error);
        this.blockUI.stop();
        Swal.fire({
          title: 'ERROR!!!',
          text: error.message,
          icon: 'error'});
      });
    }else{
      this._ps.printReceiptDsto(id,ref_banco).subscribe((response) => {
  
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        console.log(error);
        Swal.fire({
          title: 'ERROR!!!',
          text: error.error.message,
          icon: 'error'});
      });
    }
  }

}
