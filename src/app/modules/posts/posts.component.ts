import { Component, OnInit } from '@angular/core';
import { CatalogoPagoService } from '../../services/dashboard/catalogoPago.service';
import { CatalogoPago } from '../../services/dashboard/catalogoPago';
import { CatalogoPagoTipoUser } from '../../services/dashboard/catalogoPagoTipoUser';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ListaUsuariosService } from '../../services/dashboard/listausuarios/listausuarios.service';
import { Carrito } from '../shoppingcart/shoppingcart.model';
import { startWith } from 'rxjs/operators';
export interface Concepto {
  concepto: string;
  descripcion: string;
  punit: number;
  paquete: number | null;
  alumnos: string;
  personal: any
  incorporadas: any;
  ures: string;
  publico: string;
}
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss', '../../../assets/css/login.css']
})
export class PostsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  isSubmitted=false;
  ToggleButton: boolean = true;
  forma: FormGroup;
  catalogopago: CatalogoPago[];
  catalogoPagoTipoUser: CatalogoPagoTipoUser[];
  array = new Array();
  arrayInit = new Array();
  arrayLength: Number = 0;
  readOnlyInput = true;
  tipoUsuario: string;
  uresUsuario: string;

  constructor(private _cp: CatalogoPagoService, private fb: FormBuilder) { }

  ngOnInit() {

    //sessionStorage.removeItem("shoppingCart");

    if (sessionStorage.getItem('shoppingCart')) {
      this.arrayInit = JSON.parse(sessionStorage.getItem('shoppingCart'));
      this.arrayLength = this.arrayInit.length;
    }


    window.scroll(0, 0);
    this.crearFormulario();
    /*
        this.concepto.valueChanges.pipe(startWith(null)).subscribe((value:Concepto)=>{
          if(value){
            console.log('has value',+value.punit)
            if(+value.punit==1){
              console.log('es igual a 1')
              this.punit.enable();
            } else{
              console.log('no tiene 1 ')
              this.punit.disable();
            }
          } else{
            console.log('has not value')
            this.punit.disable();
          }
        })*/
    this._cp.getCatalogoPagoTipoUser(sessionStorage.getItem('Tipo').toString()).subscribe(
      (catalogoPagoTipoUser) => {
        this.catalogoPagoTipoUser = catalogoPagoTipoUser;
        //console.log(catalogoPagoTipoUser);
      }
    )


  }


  textSelect() {
    const concepto: Concepto = this.concepto.value
    console.log('evento', concepto)
    console.log('asignando', concepto.punit)
    this.punit.setValue(concepto.punit);
    if (+concepto.punit == 1) {
      console.log('es igual a 1')
      this.punit.enable();
    } else {
      console.log('no tiene 1 ')
      this.punit.disable();
    }

  }

  get cantidadNovalido() {
    return this.forma.get('cantidad').invalid && this.forma.get('cantidad').touched
  }

  crearFormulario() {

    this.forma = this.fb.group({
      concepto: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.max(999), Validators.min(1)]],
      p_unitario: [0, [Validators.required, Validators.max(99999), Validators.min(1)]],
      paquete: []
    });
    this.punit.disable();
  }

  add() {
this.isSubmitted=true;
     if (this.forma.invalid) {
       alert('falta capturar campos!');
      return Object.values(this.forma.controls).forEach(control => {
        control.markAsTouched();
        this.blockUI.stop();
      })
     
      return;
    } 

    const conceptoROW: Concepto = this.concepto.value;
    // conceptoROW.descripcion
    const elemento: Carrito = {
      dpago_idingreso: conceptoROW.concepto,
      Mount: this.importe,
      Descrip: conceptoROW.descripcion,
      dpago_cantidad: this.forma.get('cantidad').value,
      dpago_punit: this.punit.value,
      descto: null,
      dto_pagar: null,
      regidescto: null,
      paquete: conceptoROW.paquete
    };
    if (sessionStorage.getItem('shoppingCart') === null) {
      this.array = [];
    } else {
      this.array = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }
    this.array.push(elemento);
    sessionStorage.setItem('shoppingCart', JSON.stringify(this.array));
    this.arrayLength = this.array.length;
    Swal.fire('Agregado al carrito', `El articulo ${elemento.Descrip} fue agregado exitosamente`, 'success').then(r => {
      if (r.isConfirmed) {
        this.forma.reset({
          concepto: null,
          cantidad: 1,
          p_unitario: { value: 0, disabled: true },
          paquete: null
        });

        console.log('p_unitario deshabilitado:', this.punit.disabled);

      }
    });

  }


  get concepto() {
    return this.forma.get('concepto') as FormControl;
  }

  get cantidad() {
    return this.forma.get('cantidad') as FormControl;
  }

  get punit() {
    return this.forma.get('p_unitario') as FormControl;
  }

  get importe(): number {
    const cantidad = Number(this.forma.get('cantidad').value) || 0;
    const precioUnitario = Number(this.forma.get('p_unitario').value) || 0;

    return cantidad * precioUnitario;
  }
}
