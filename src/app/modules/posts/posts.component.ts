import { Component, ElementRef, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CatalogoPagoService } from '../../services/dashboard/catalogoPago.service';
import { CatalogoPago } from '../../services/dashboard/catalogoPago';
import { CatalogoPagoTipoUser } from '../../services/dashboard/catalogoPagoTipoUser';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ListaUsuariosService } from '../../services/dashboard/listausuarios/listausuarios.service';
import { DescuentosService } from 'src/app/services/dashboard/descuentos/descuentos.service';
import { Descuentos } from 'src/app/services/dashboard/descuentos/descuentos';
import { erroresFormulario } from '../componentes-genericos/manejo-errores-forma/errores';
import { DetPagoOnlineDTO, PagoOnline } from './interfaces/catalogos.post';
import { EvoService } from '../../services/dashboard/evo.service';
import { PagoServiciosService } from '../../services/dashboard/pagoServicios/pagoservicios.service';

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

  session_id!: string;
  successIndicator!: string;

  constructor( 
    private _cp: CatalogoPagoService, 
    private fb: FormBuilder, 
    private _lus: ListaUsuariosService,
    private _ds: DescuentosService,
    private _evo: EvoService, 
    private _ps: PagoServiciosService,) { }

  async ngOnInit() {
    this.blockUI.start('Cargando datos...');
    this.crearFormulario();
    this.getDescuentos();
    this.getCatalogoServicios(sessionStorage.getItem('Tipo').toString());
    this.forma.controls['referencia'].setValue(await this.getReferencia());
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
    this.forma.get('idingreso').setValue('');
    this.forma.get('punit').setValue('');
    this.forma.get('cambiaPrecio').setValue('N');
    this.forma.get('cantidad').setValue(1);
  }

  seleccionarServicio(event:CatalogoPagoTipoUser){
    this.limpiarCamposServicio();
    this.selectedIndexServicios = -1;
    this.forma.get('servicio').setValue(event.descripcion);
    this.forma.get('idingreso').setValue(event.concepto);
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
    this.sumarTotal();
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
      let id = this.forma.get('idingreso').value;
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

  get cantidadNovalido(){
    return this.forma.get('cantidad').invalid && this.forma.get('cantidad').touched
  }

  crearFormulario(){
    this.forma = this.fb.group({
      idingreso: ['', Validators.required],
      servicio: '',
      cantidad: [1, [Validators.required,Validators.max(999),Validators.min(1)]],
      punit: ['', [Validators.required,Validators.max(99999),Validators.min(0.01)]],
      cambiaPrecio: 'N',
      user: sessionStorage.getItem('usuID'),
      nombre: sessionStorage.getItem('Nombre'),
      paquete: '',
      numservicios: 0,
      descuento: '',
      dsctodescrip: '',
      total: '',
      referencia: '',
    });
    this.blockUI.stop();
  }

  async Pagar() {
    this.blockUI.start();
    const detalle: Array<DetPagoOnlineDTO> = this.arreglo.getRawValue().map((e)=>{
      return {
          idingreso: e.idingreso,
          cantidad: e.cantidad,
          punit: e.punit,
          regidescto: e.regiddescto||null,
          descto: e.descto||null,
          dtoPagar: e.dtopagar||null,
      }
    });

    const entity = { 
      usuaid: this.forma.get('user').value||null, 
      montoapagar: this.forma.get('total').value,
      referencia: this.forma.get('referencia').value,
      concepto: "PAGO DE "+(this.forma.get('nombre').value||this.forma.get('user').value)+" REF: "+this.forma.get('referencia').value+" FOLIO: ",
      user: this.forma.get('user').value||null,
      detalle: detalle 
    }

    let total = this.forma.get('total').value;
    this._evo.getEvo(total, entity).subscribe({
      next: (response: any) => {
        console.warn('response', response)
        this.session_id = response.session_id;
        this.successIndicator = response.successIndicator;
        sessionStorage.MasterID = this.forma.get('referencia').value;
        this.forma.reset();
        this.limparDetalle();
        this.getDescuentos();
        this.getCatalogoServicios(sessionStorage.getItem('Tipo').toString());
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

  async getReferencia():Promise<string>{
    const ref = await this._ps.getTsqpagosonline().toPromise();
    return ref as string;
  }
}
