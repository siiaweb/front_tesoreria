import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CatalogoPagoService } from '../../services/dashboard/catalogoPago.service';
import { CatalogoPago } from '../../services/dashboard/catalogoPago';
import { CatalogoPagoTipoUser } from '../../services/dashboard/catalogoPagoTipoUser';
import { Validators, FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { BlockUI, BlockUIService, NgBlockUI } from 'ng-block-ui';
import { DescuentosService } from 'src/app/services/dashboard/descuentos/descuentos.service';
import { Descuentos } from 'src/app/services/dashboard/descuentos/descuentos';
import { erroresFormulario } from '../componentes-genericos/manejo-errores-forma/errores';
import { EvoService } from '../../services/dashboard/evo.service';
import { MatSelectChange } from '@angular/material/select';
import { maxValidator, minValidator } from './validators/validators.post';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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



@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

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

  forma!: FormGroup;
  formDet: FormGroup = this.fb.group({ detalle: this.fb.array([]) });

  get arreglo() {
    return this.formDet.controls["detalle"] as FormArray;
  }

  get Detalles() {
    return (this.arreglo).controls as FormGroup[];
  }

  catalogopago!: CatalogoPago[];
  catalogoPagoTipoUser: CatalogoPagoTipoUser[] = [];
  descuentos!: Descuentos[];

  session_id!: string;
  successIndicator!: string;

  constructor(
    private _cp: CatalogoPagoService,
    private fb: FormBuilder,
    private _ds: DescuentosService,
    private _evo: EvoService,
    private blockUIService: BlockUIService,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute
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
    //alert('constructor')
    const orderId =
      this.route.snapshot.queryParamMap.get('orderId');
    if (orderId) {
      this._evo.cortar(
        orderId,
        'INVALID_REQUEST',
        'EL USUARIO CANCELO O REFRESCO DESPUES DE CANCELAR'
      ).subscribe({
        next: response => {
          console.log('Respuesta de cortar:', response);

        },
        error: error => {
          console.error('Error en cortar:', error);
        },
        complete: () => {
          console.log('Solicitud cortar completada');
        }
      });
    }

  }
  ngOnDestroy(): void {
    // alert('ondestroy')
    //throw new Error('Method not implemented.');
    //this._evo.stopPolling();
    delete (window as any).errorCallback;
    delete (window as any).cancelCallback;
    delete (window as any).completeCallback;
  }
  handleError(error: any) {
    console.error('Error en el pago de EVO:', error);
    // Tu lógica para mostrar un mensaje de error al usuario
  }

  handleCancel() {
    console.warn('El usuario canceló el pago');
    // Tu lógica al cancelar el pago
  }


  private routerSubscription?: Subscription;
  prepararEvo(): void {
    const scriptUrl =
      'https://evopaymentsmexico.gateway.mastercard.com/static/checkout/checkout.min.js';

    const existente = Array.from(document.scripts)
      .find(script => script.src === scriptUrl);

    if (existente) {
      console.log('Checkout.js ya está agregado; no se insertará otra vez.');
      return;
    }

    const script = this.renderer.createElement('script') as HTMLScriptElement;

    this.renderer.setAttribute(script, 'src', scriptUrl);
    this.renderer.setAttribute(script, 'data-error', 'errorCallback');
    this.renderer.setAttribute(script, 'data-cancel', 'cancelCallback');
    this.renderer.setAttribute(script, 'data-complete', 'completeCallback');

    script.onerror = () => console.error('Error cargando Checkout.js');

    this.renderer.appendChild(document.head, script);
  }
  async ngOnInit() {
    this.prepararEvo();//esta linea es importante
    this.blockUI.start('Cargando datos...');
    this.crearFormulario();
    const tipo: string = sessionStorage.getItem('Tipo').toString();
    this.getCatalogoServicios(tipo);
    const entity = JSON.parse(sessionStorage.getItem('shoppingCart'));
    const referencia = sessionStorage.getItem('MasterID');
    if (entity) {
      console.log(entity);
      this.forma.patchValue(entity.forma);
      this.forma.controls['referencia'].setValue(referencia || null);
      this.getDescuentos(entity.forma.descuento || null);
      entity.detalles.map(det => {
        const element = this.fb.group({ ...this.detalle });
        element.patchValue(det);
        this.arreglo.push(element);
      })
    } else {
      this.getDescuentos(null);
    }
  }

  seleccionarDescuento(event: MatSelectChange) {
    let value: Descuentos = event.value;
    this.forma.controls['descuento'].setValue(value.vdes_foldescto);
    this.limparDetalle();
    this._ds.getDescuentoDet(value.vdes_foldescto).subscribe({
      next: (resp) => {
        resp.map(det => {
          const element = this.fb.group({ ...this.detalle });
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
      error: (error) => {
        this.blockUIService.stop('global')
        console.error('error', error);
        this.limpiarCamposDescuento();
        erroresFormulario.handleError(error);
      }
    })
  }

  limpiarCamposDescuento() {
    this.forma.controls['descuento'].setValue('');
    this.forma.controls['dsctodescrip'].setValue('');
    this.limparDetalle();
  }

  deseleccionarServicio() {
    this.forma.get('servicio').setValue('');
    this.limpiarCamposServicio();
  }

  limpiarCamposServicio() {
    this.forma.get('idingreso').setValue('');
    this.forma.get('punit').setValue('');
    this.forma.get('cambiaPrecio').setValue('N');
    this.forma.get('cantidad').setValue(1);
  }

  seleccionarServicio(event: MatSelectChange) {
    let value: CatalogoPagoTipoUser = event.value;
    this.forma.get('idingreso').setValue(value.concepto);
    this.forma.get('punit').setValue(parseFloat(value.punit).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    this.forma.get('paquete').setValue(value.paquete);
    if (parseFloat(value.punit) === 1) this.forma.get('cambiaPrecio').setValue('S');
    else this.forma.get('cambiaPrecio').setValue('N');
  }

  formatearPrecio() {
    let precio = parseFloat(this.forma.get('punit').value.toString().replace(/,/g, ''));
    if (isNaN(precio)) this.forma.get('punit').setValue('1.00')
    else this.forma.get('punit').setValue(precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }

  ajustarCantidad(num: number) {
    let cant = this.forma.get('cantidad').value;
    cant = Math.max(1, Math.min(999, cant + num));
    this.forma.get('cantidad').setValue(cant);
  }

  eliminarFila(i: number) {
    this.arreglo.removeAt(i);
    this.sumarTotal();
  }

  limparDetalle() {
    for (let i = this.arreglo.length; 0 <= i; i--) {
      this.arreglo.removeAt(i);
    }
  }

  agregarDetalle() {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Hay errores en los campos.',
        html: erroresFormulario.traerErroresFormularios(this.forma, null, this.diccionario),
      });
    } else {
      let id = this.forma.get('idingreso').value;
      let encontrada = null;
      if (this.forma.get('cambiaPrecio').value !== 'S') {
        encontrada = this.Detalles.find(a => a.get('idingreso').value === id);
      }
      const element = this.fb.group({ ...this.detalle });
      let cant = parseInt(this.forma.get('cantidad').value);
      let punit = parseFloat(this.forma.get('punit').value.toString().replace(/,/g, ''));
      if (encontrada) {
        let cantactual = parseInt(encontrada.controls['cantidad'].value);
        encontrada.controls['cantidad'].setValue(cantactual + cant);
        encontrada.controls['subtotal'].setValue((cantactual + cant) * punit);
      } else {
        element.controls['idingreso'].setValue(id);
        element.controls['concepto'].setValue(this.forma.get('servicio')?.value.descripcion);
        element.controls['cantidad'].setValue(cant);
        element.controls['punit'].setValue(punit);
        element.controls['subtotal'].setValue(cant * punit);
        element.controls['paquete'].setValue(this.forma.get('paquete').value);
        this.arreglo.push(element);
      }
      this.sumarTotal();
      this.calcularServicios();
      this.deseleccionarServicio();
    }
  }

  calcularServicios() {
    let suma = 0;
    this.Detalles.map(det => {
      suma += parseInt(det.controls['cantidad'].value);
    })
    this.forma.get('numservicios').setValue(suma);
  }

  sumarTotal() {
    let total = 0
    this.Detalles.map(det => {
      total += parseFloat(det.controls['subtotal'].value);
    })
    this.forma.get('total').setValue(total);
  }

  get cantidadNovalido() {
    return this.forma.get('cantidad').invalid && this.forma.get('cantidad').touched
  }

  crearFormulario() {
    this.forma = this.fb.group({
      idingreso: ['', Validators.required],
      servicio: '',
      cantidad: [1, [Validators.required, maxValidator(999), minValidator(1)]],
      punit: ['', [Validators.required, maxValidator(99999999), minValidator(0.01)]],
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
    this.blockUIService.start('global', 'pagando...')
    const detalle = this.arreglo.getRawValue().map((e) => {
      return {
        idingreso: e.idingreso,
        cantidad: e.cantidad,
        punit: e.punit,
        regidescto: e.regiddescto || null,
        descto: e.descto || null,
        dtoPagar: e.dtopagar || null,
        paquete: e.paquete || null,
      }
    });

    const entity = {
      usuaid: this.forma.get('user').value,
      montoapagar: this.forma.get('total').value,
      referencia: this.forma.get('referencia').value,
      concepto: "PAGO DE " + (this.forma.get('nombre').value || this.forma.get('user').value),
      user: this.forma.get('user').value || null,
      foldescto: this.forma.get('descuento').value || null,
      detalle: detalle
    }
    sessionStorage.removeItem("shoppingCart");
    sessionStorage.shoppingCart = JSON.stringify({ forma: this.forma.getRawValue(), detalles: this.arreglo.getRawValue() });

    this._evo.mostrarEvo(entity).subscribe({
      next: (resp) => {
        this.blockUIService.stop('global')
        this.forma.get('referencia').setValue(resp.referencia);

      },
      error: (error) => {
        this.blockUIService.stop('global');
        erroresFormulario.handleError(error);
      },
      complete: () => {

      }
    })
    //this.mostrarEvo(entity)
  }

  // Cerrar
  public closeEvoModal(event: any): void {
    this._evo.closeEvoModal(event, this.referencia.value);
  }
  getCatalogoServicios(tipo: string) {
    this._cp.getCatalogoPagoTipoUser(tipo).subscribe({
      next: (catalogoPagoTipoUser) => {
        this.catalogoPagoTipoUser = catalogoPagoTipoUser;
      },
      error: (error) => {
        this.blockUIService.stop('global');
        erroresFormulario.handleError(error);
      }
    })
  }

  getDescuentos(id: string) {
    this._ds.getDescuento().subscribe({
      next: (descuentos) => {
        if (descuentos.length != 0) {
          this.descuentos = descuentos
          this.llenarDescuento(id);
        }
      },
      error: (error) => {
        this.blockUIService.stop('global');
        erroresFormulario.handleError(error);
      }
    })
  }

  llenarDescuento(id: string) {
    const encontrada = this.descuentos.find(s => s.vdes_foldescto?.toString() === id?.toString());
    if (encontrada) {
      this.forma.controls['dsctodescrip'].setValue(encontrada);
    }
  }




  @HostListener('window:pageshow', ['$event'])
  onPageShow(event: PageTransitionEvent): void {
    if (event.persisted) {
      console.log('La página fue restaurada desde BFCache');
      window.location.reload()
      // Consulta aquí el estado de la transacción al backend.
    }
  }

  @HostListener('window:evo-checkout-error', ['$event'])
  onEvoCheckoutError(event: CustomEvent): void {
    console.error('Error reportado por EVO:', event.detail);
  }


  @HostListener('window:evo-checkout-finished')
  onEvoCheckoutFinished(): void {
    console.log('onEvoCheckoutFinished')
    this.blockUIService.stop('global');
  }

  get referencia() {
    return this.forma.get('referencia') as FormControl;
  }

}
