import { Component, OnInit } from '@angular/core';
import { CatalogoPagoService } from '../../services/dashboard/catalogoPago.service';
import { CatalogoPago } from '../../services/dashboard/catalogoPago';
import { CatalogoPagoTipoUser } from '../../services/dashboard/catalogoPagoTipoUser';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ListaUsuariosService } from '../../services/dashboard/listausuarios/listausuarios.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  ToggleButton: boolean = true;

  forma: FormGroup;

  catalogopago:CatalogoPago[];
  catalogoPagoTipoUser:CatalogoPagoTipoUser[];

  IDServicio:string;
  Monto:string;
  text_Select:string;
  monto_Select:number = 0;
  precioUnit:number = 0;
  id_Select:string;

  array = new Array();
  arrayInit = new Array();

  arrayLength: Number = 0;

  readOnlyInput = true;

  tipoUsuario: string;
  uresUsuario: string;

  constructor( private _cp: CatalogoPagoService, private fb: FormBuilder, private _lus: ListaUsuariosService ) { }

  ngOnInit() {

    //sessionStorage.removeItem("shoppingCart");

    if(sessionStorage .getItem('shoppingCart')){
      this.arrayInit = JSON.parse(sessionStorage .getItem('shoppingCart'));
      this.arrayLength = this.arrayInit.length;
    }
   

    window.scroll(0, 0);
    this.crearFormulario();

    this._cp.getCatalogoPagoTipoUser(sessionStorage.getItem('Tipo').toString()).subscribe(
      (catalogoPagoTipoUser) => {
        this.catalogoPagoTipoUser = catalogoPagoTipoUser;
        //console.log(catalogoPagoTipoUser);
      }
    )

    /*
    this._lus.getListaUsuario().subscribe(
      (usuario) => {
        this.tipoUsuario = usuario[0].tipo_usuario;
        this.uresUsuario = usuario[0].unidad_responsable;
        console.log(usuario);
      }
    )
    */
  }

  buttonEnabled(ValorSelect){
    this.ToggleButton = false;
    //var splitted = ValorSelect.split(","); 
  }

  textSelect($event) {
    this.text_Select = $event.target.options[$event.target.options.selectedIndex].text;
    var splitted = $event.target.value.split(","); 
    this.id_Select = splitted[0];
    this.monto_Select = splitted[1];
    this.precioUnit = splitted[1];
    this.forma.get('p_unitario').setValue(splitted[1]);
    if(splitted[1] === '1'){
      this.readOnlyInput = false;
    }else{
      this.readOnlyInput = true;
    }
  }

  suma(){
    //var splitted = this.forma.get('servicios').value.split(","); 
    this.monto_Select = this.forma.get('p_unitario').value * Number(this.forma.get('cantidad').value);
  }

  sumaTecleada(ValorTecleado){
    this.monto_Select = ValorTecleado;
  }

  get cantidadNovalido(){
    return this.forma.get('cantidad').invalid && this.forma.get('cantidad').touched
  }

  crearFormulario(){

    this.forma = this.fb.group({
      servicios: ['', Validators.required],
      cantidad: ['1', [Validators.required,Validators.max(999),Validators.min(1)]],
      p_unitario: ['', [Validators.required,Validators.max(99999),Validators.min(1)]]
    });
  }

  add(){
    this.blockUI.start();
    if (sessionStorage .getItem('shoppingCart') === null) {
      this.array = [];
      this.array.push({"dpago_idingreso":this.id_Select, "Mount":this.monto_Select, "Descrip":this.text_Select,
                       "dpago_cantidad":this.forma.get('cantidad').value, "dpago_punit":this.forma.get('p_unitario').value,});
      sessionStorage.setItem('shoppingCart', JSON.stringify(this.array));
      this.blockUI.stop();
      Swal.fire('Agregado al carrito', `El articulo ${this.text_Select} fue agregado exitosamente`, 'success');
    }else{
      this.array = JSON.parse(sessionStorage .getItem('shoppingCart'));
      this.array.push({"dpago_idingreso":this.id_Select, "Mount":this.monto_Select, "Descrip":this.text_Select,
      "dpago_cantidad":this.forma.get('cantidad').value, "dpago_punit":this.forma.get('p_unitario').value,});
      sessionStorage.setItem('shoppingCart', JSON.stringify(this.array));
      this.blockUI.stop();
      Swal.fire('Agregado al carrito', `El articulo ${this.text_Select} fue agregado exitosamente`, 'success');     
    }
    this.forma.get('cantidad').setValue('1');
    this.arrayLength = this.array.length;
    this.forma.get('servicios').setValue('');
    this.id_Select = "";
    this.text_Select = "";
    this.monto_Select = 0;
    this.precioUnit = 0;
    this.ToggleButton = true;
    this.forma.get('p_unitario').setValue('');
  }
}
