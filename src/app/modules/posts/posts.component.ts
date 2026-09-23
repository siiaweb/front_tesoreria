import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CatalogoPagoService } from '../../services/dashboard/catalogoPago.service';
import { CatalogoPago } from '../../services/dashboard/catalogoPago';
import { CatalogoPagoTipoUser } from '../../services/dashboard/catalogoPagoTipoUser';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ListaUsuariosService } from '../../services/dashboard/listausuarios/listausuarios.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { DescuentosService } from 'src/app/services/dashboard/descuentos/descuentos.service';
import { Descuentos } from 'src/app/services/dashboard/descuentos/descuentos';
import { erroresFormulario } from '../componentes-genericos/manejo-errores-forma/errores';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostsComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  detalle: any = {
    idingreso: '',
    concepto: '',
    cantidad: '',
    punit: '',
    subtotal: '',
    regiddescto: '',
    descto: '',
    dtopagar: '',
    paquete: '',
  }

  diccionario: any = {
    cantidad: 'Cantidad',
    punit: 'Precio'
  }

  forma: FormGroup;
  formDet: FormGroup = this.fb.group({detalle:this.fb.array([])});

  get arreglo() {
    return this.formDet.controls["detalle"] as FormArray;
  }

  get Detalles(){
    return (this.arreglo).controls as FormGroup[];
  }

  catalogopago:CatalogoPago[];
  catalogoPagoTipoUser:CatalogoPagoTipoUser[] = [];
  filteredCatalogoServicios: CatalogoPagoTipoUser[] = [];
  descuentos: Descuentos[];

  openDescto: boolean = false;
  openServicios: boolean = false;
  selectedIndexServicios: number = 0;

  @ViewChildren('dropdownService') dropdownItems!: QueryList<ElementRef>;

  constructor( 
    private _cp: CatalogoPagoService, 
    private fb: FormBuilder, 
    private _lus: ListaUsuariosService,
    private _ds: DescuentosService ) { }

  ngOnInit() {
    this.crearFormulario();
    this.getDescuentos();
    this.getCatalogoServicios(sessionStorage.getItem('Tipo').toString());
  }

  openDescuento(){
    this.openDescto = !this.openDescto;
  }

  seleccionarDescuento(event:Descuentos){
    this.forma.controls['descuento'].setValue(event.vdes_foldescto);
    this.forma.controls['dsctodescrip'].setValue(event.vdes_foldescto+' - '+event.vdes_descdescrip);
    this.openDescto = false;
    this.limparDetalle();
    this._ds.getDescuentoDet(event.vdes_foldescto).subscribe({
      next: (resp)=> {
        resp.map(det =>{
          const element = this.fb.group({...this.detalle});
          element.controls['idingreso'].setValue(det.vdes_id);
          element.controls['concepto'].setValue(det.vdes_concepto);
          element.controls['cantidad'].setValue(det.vdes_cantidad);
          element.controls['punit'].setValue(det.vdes_punit);
          element.controls['regiddescto'].setValue(det.vdes_regid);
          element.controls['descto'].setValue(det.vdes_porc);
          element.controls['dtopagar'].setValue(det.vdes_a_pagar);
          element.controls['subtotal'].setValue(det.vdes_a_pagar);
          this.arreglo.push(element);
        })
        this.calcularServicios();
        this.sumarTotal();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un error al cargar los detalles del descuento, intentelo de nuevo',
          showConfirmButton: true,
        }).then(() => {
          this.limpiarCamposDescuento();
        });
      }
    })
  }

  limpiarCamposDescuento(){
    this.forma.controls['descuento'].setValue('');
    this.forma.controls['dsctodescrip'].setValue('');
    this.openDescto = false;
  }

  buscarServicio(event: any){
    const filter = event.target.value.trim().toUpperCase()||'';
    this.selectedIndexServicios = -1;
    this.openServicios = true;
    if (filter === '') {
      this.deseleccionarServicio();
    }else{
      this.filteredCatalogoServicios = this.catalogoPagoTipoUser.filter(item =>
        item.descripcion.toUpperCase().includes(filter) ||
        item.concepto.toUpperCase().includes(filter)
      );
    }
  }

  deseleccionarServicio(){
    this.openServicios = false;
    this.forma.get('servicio').setValue('');
    this.limpiarCamposServicio();
    this.filteredCatalogoServicios = this.catalogoPagoTipoUser;
  }

  limpiarCamposServicio(){
    this.forma.get('dpago_idingreso').setValue('');
    this.forma.get('punit').setValue('');
    this.forma.get('cambiaPrecio').setValue('N');
    this.forma.get('cantidad').setValue(1);
  }

  seleccionarServicio(event:CatalogoPagoTipoUser){
    this.limpiarCamposServicio();
    this.selectedIndexServicios = -1;
    this.forma.get('servicio').setValue(event.descripcion);
    this.forma.get('dpago_idingreso').setValue(event.concepto);
    this.forma.get('punit').setValue(parseFloat(event.punit).toLocaleString('es-MX',{minimumFractionDigits: 2, maximumFractionDigits: 2}));
    this.forma.get('paquete').setValue(event.paquete);
    if(parseFloat(event.punit) === 1) this.forma.get('cambiaPrecio').setValue('S');
    this.filteredCatalogoServicios = [];
    this.openServicios = false;
  }

  formatearPrecio(){
    let precio = parseFloat(this.forma.get('punit').value.toString().replace(/,/g, ''));
    if(isNaN(precio)) this.forma.get('punit').setValue('1.00')
    else this.forma.get('punit').setValue(precio.toLocaleString('es-MX',{minimumFractionDigits: 2, maximumFractionDigits: 2}));
  }

  ajustarCantidad(num: number){
    let cant = this.forma.get('cantidad').value;
    cant = Math.max(1, Math.min(999, cant + num));
    this.forma.get('cantidad').setValue(cant);
  }

  onKeyDown(event: KeyboardEvent){
    if (this.filteredCatalogoServicios.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (this.selectedIndexServicios < this.filteredCatalogoServicios.length - 1) {
          this.selectedIndexServicios++;
        } else {
          this.selectedIndexServicios = 0;
        }
        this.scrollToOption();
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.selectedIndexServicios > 0) {
          this.selectedIndexServicios--;
        } else {
          this.selectedIndexServicios = this.filteredCatalogoServicios.length - 1;
        }
        this.scrollToOption();
        break;

      case 'Enter':
        if (this.selectedIndexServicios >= 0 && this.selectedIndexServicios < this.filteredCatalogoServicios.length) {
          event.preventDefault();
          this.seleccionarServicio(this.filteredCatalogoServicios[this.selectedIndexServicios]);
          this.selectedIndexServicios = -1;
        }
        break;

      case 'Escape':
        this.filteredCatalogoServicios = this.catalogoPagoTipoUser;
        this.selectedIndexServicios = -1;
        break;
    }
  }

  scrollToOption() {
    requestAnimationFrame(() => {
      const itemsArray = this.dropdownItems.toArray();
      if (itemsArray && itemsArray[this.selectedIndexServicios]) {
        itemsArray[this.selectedIndexServicios].nativeElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    });
  }

  onBlur(){
    setTimeout(() => {
      this.filteredCatalogoServicios = this.catalogoPagoTipoUser;
      this.selectedIndexServicios = -1;
      this.openServicios = false;
    }, 200);
  }

  setSelectedIndex(i: number){
    this.selectedIndexServicios = i;
  }

  onBlurDescuentos(){
    setTimeout(() => {
      this.openDescto = false;
    }, 200);
  }

  eliminarFila(i:number){
    this.arreglo.removeAt(i);
  }

  limparDetalle(){
    for(let i = this.arreglo.length; 0<=i ; i--){
      this.arreglo.removeAt(i);
    }
  }

  agregarDetalle(){
    if(this.forma.invalid){
      this.forma.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Hay errores en los campos.',
        html: erroresFormulario.traerErroresFormularios(this.forma, null, this.diccionario),
      });
    }else{
      const element = this.fb.group({...this.detalle});
      let id = this.forma.get('dpago_idingreso').value;
      let encontrada = this.Detalles.find(a => a.get('idingreso').value === id);
      let cant = parseInt(this.forma.get('cantidad').value);
      let punit = parseFloat(this.forma.get('punit').value.toString().replace(/,/g, ''));
      if(encontrada){
        let cantactual = parseInt(encontrada.controls['cantidad'].value);
        encontrada.controls['cantidad'].setValue(cantactual+cant);
        encontrada.controls['subtotal'].setValue((cantactual+cant)*punit);
      }else{
        element.controls['idingreso'].setValue(id);
        element.controls['concepto'].setValue(this.forma.get('servicio').value);
        element.controls['cantidad'].setValue(cant);
        element.controls['punit'].setValue(punit);
        element.controls['subtotal'].setValue(cant*punit);
        element.controls['paquete'].setValue(this.forma.get('paquete').value);
        this.arreglo.push(element);
      }
      this.sumarTotal();
      this.calcularServicios();
      this.deseleccionarServicio();
    }
  }

  calcularServicios(){
    let suma = 0;
    this.Detalles.map(det => {
      suma += parseInt(det.controls['cantidad'].value);
    })
    this.forma.get('numservicios').setValue(suma);
  }

  sumarTotal(){
    let total = 0
    this.Detalles.map(det => {
      total += parseFloat(det.controls['subtotal'].value);
    })
    this.forma.get('total').setValue(total);
  }


  // textSelect($event) {
  //   this.text_Select = $event.target.options[$event.target.options.selectedIndex].text;
  //   var splitted = $event.target.value.split(","); 
  //   this.id_Select = splitted[0];
  //   this.monto_Select = splitted[1];
  //   this.precioUnit = splitted[1];
  //   this.forma.get('p_unitario').setValue(splitted[1]);
  //   if(splitted[1] === '1'){
  //     this.readOnlyInput = false;
  //   }else{
  //     this.readOnlyInput = true;
  //   }
  // }

  get cantidadNovalido(){
    return this.forma.get('cantidad').invalid && this.forma.get('cantidad').touched
  }

  crearFormulario(){
    this.forma = this.fb.group({
      dpago_idingreso: ['', Validators.required],
      servicio: '',
      cantidad: [1, [Validators.required,Validators.max(999),Validators.min(1)]],
      punit: ['', [Validators.required,Validators.max(99999),Validators.min(0.01)]],
      cambiaPrecio: 'N',
      paquete: '',
      numservicios: 0,
      descuento: '',
      dsctodescrip: '',
      total: '',
    });
  }

  // add(){
  //   this.blockUI.start();
  //   if (sessionStorage .getItem('shoppingCart') === null) {
  //     this.array = [];
  //     this.array.push({"dpago_idingreso":this.id_Select, "Mount":this.monto_Select, "Descrip":this.text_Select,
  //                      "dpago_cantidad":this.forma.get('cantidad').value, "dpago_punit":this.forma.get('p_unitario').value,});
  //     sessionStorage.setItem('shoppingCart', JSON.stringify(this.array));
  //     this.blockUI.stop();
  //     Swal.fire('Agregado al carrito', `El articulo ${this.text_Select} fue agregado exitosamente`, 'success');
  //   }else{
  //     this.array = JSON.parse(sessionStorage .getItem('shoppingCart'));
  //     this.array.push({"dpago_idingreso":this.id_Select, "Mount":this.monto_Select, "Descrip":this.text_Select,
  //     "dpago_cantidad":this.forma.get('cantidad').value, "dpago_punit":this.forma.get('p_unitario').value,});
  //     sessionStorage.setItem('shoppingCart', JSON.stringify(this.array));
  //     this.blockUI.stop();
  //     Swal.fire('Agregado al carrito', `El articulo ${this.text_Select} fue agregado exitosamente`, 'success');     
  //   }
  //   this.forma.get('cantidad').setValue('1');
  //   this.arrayLength = this.array.length;
  //   this.forma.get('servicio').setValue('');
  //   this.id_Select = "";
  //   this.text_Select = "";
  //   this.monto_Select = 0;
  //   this.precioUnit = 0;
  //   this.ToggleButton = true;
  //   this.forma.get('p_unitario').setValue('');
  // }

  getCatalogoServicios(tipo:string){
    this._cp.getCatalogoPagoTipoUser(tipo).subscribe(
      (catalogoPagoTipoUser) => {
        this.catalogoPagoTipoUser = catalogoPagoTipoUser;
        this.filteredCatalogoServicios = catalogoPagoTipoUser;
      }
    )
  }

  getDescuentos(){
    this._ds.getDescuento().subscribe((descuentos) => {
        this.descuentos = descuentos
      }
    )
  }
}
