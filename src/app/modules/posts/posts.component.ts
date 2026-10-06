import { Component, HostListener, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CatalogoPagoService } from '../../services/dashboard/catalogoPago.service';
import { CatalogoPago } from '../../services/dashboard/catalogoPago';
import { CatalogoPagoTipoUser } from '../../services/dashboard/catalogoPagoTipoUser';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { BlockUI, BlockUIService, NgBlockUI } from 'ng-block-ui';
import { ListaUsuariosService } from '../../services/dashboard/listausuarios/listausuarios.service';
import { DescuentosService } from 'src/app/services/dashboard/descuentos/descuentos.service';
import { Descuentos } from 'src/app/services/dashboard/descuentos/descuentos';
import { erroresFormulario } from '../componentes-genericos/manejo-errores-forma/errores';
import { EvoService } from '../../services/dashboard/evo.service';
import { PagoServiciosService } from '../../services/dashboard/pagoServicios/pagoservicios.service';
import { MatSelectChange } from '@angular/material/select';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { EMPTY, interval, Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';

interface EvoCheckout {
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
  filteredCatalogoServicios: CatalogoPagoTipoUser[] = [];
  descuentos!: Descuentos[];

  session_id!: string;
  successIndicator!: string;

  constructor(
    private _cp: CatalogoPagoService,
    private fb: FormBuilder,
    private _ds: DescuentosService,
    private _evo: EvoService,
    private _ps: PagoServiciosService,
    private blockUIService: BlockUIService,
    private ngZone: NgZone,
    private router: Router,
    private renderer: Renderer2
  ) {


    (window as any).errorCallback = (error: any) => {
      console.log('EVO error:', error);
      if(error.explanation.includes('expired')){

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
      this.handleCompletado(resultIndicator['resultIndicator'], resultIndicator['sessionVersion'], referencia)
    };
    console.log('construido')
  }
  ngOnDestroy(): void {
    // alert('ondestroy')
    //throw new Error('Method not implemented.');
    this.stopPolling();
    /*  delete (window as any).errorCallback;
      delete (window as any).cancelCallback;
      delete (window as any).completeCallback;*/
  }
  handleError(error: any) {
    console.error('Error en el pago de EVO:', error);
    // Tu lógica para mostrar un mensaje de error al usuario
  }

  handleCancel() {
    console.warn('El usuario canceló el pago');
    // Tu lógica al cancelar el pago
  }


  handleCompletado(resultIndicator: string, sessionVersion: string, referencia: string) {
    this.stopPolling();
    console.log('Pago completado con éxito:', resultIndicator);
    console.log('sessionVersion', sessionVersion)
    console.log('referencia', referencia)
    //alert('pago completado ' + referencia)
    this._evo.insertarRespuesta(referencia)
      .pipe(
        switchMap(response => {
          console.warn('success', response)
          sessionStorage.removeItem("MasterID");
          sessionStorage.removeItem("shoppingCart");
          //trespbanco1
          return this._ps.getPDF(referencia);
        })
      ).subscribe({
        next: (response) => {
          const blob = response.body;
          if (!blob) {
            console.error('La respuesta no contiene el PDF.');
            return;
          }

          const disposition = response.headers.get('Content-Disposition') ?? '';
          console.log('Content-Disposition recibido:', response.headers.get('Content-Disposition'));
          const nombre = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i)?.[1]
            ?.replace(/"/g, '')
            ?? 'reporte.pdf';

          const url = URL.createObjectURL(blob);
          const enlace = document.createElement('a');
          enlace.href = url;
          enlace.download = decodeURIComponent(nombre);
          document.body.appendChild(enlace);
          enlace.click();
          enlace.remove();

          setTimeout(() => URL.revokeObjectURL(url), 1000);
          this.router.navigate(['/recibos'], {
            queryParams: {
              resultIndicator: resultIndicator,
              sessionVersion: sessionVersion
            }
          });
          console.log('response success', blob)

        },
        error: (e) => {
          console.error('e.handleComplete', e)
        },
        complete: () => {
          console.log('complete handlecomplete')
        }
      })
    // Tu lógica para validar el pago contra tu backend usando el resultIndicator
  }

  prepararEvo() {
    //
    const script = this.renderer.createElement('script');

    this.renderer.setAttribute(
      script,
      'src',
      'https://evopaymentsmexico.gateway.mastercard.com/static/checkout/checkout.min.js'
    );

    this.renderer.setAttribute(
      script,
      'data-error',
      'errorCallback'
    );

    this.renderer.setAttribute(
      script,
      'data-cancel',
      'cancelCallback'
    );

    this.renderer.setAttribute(
      script,
      'data-complete',
      'completeCallback'
    );


    script.onerror = () => {
      console.error('Error cargando Checkout.js');
    };

    this.renderer.appendChild(
      document.head,
      script
    );


  }
  async ngOnInit() {
    this.prepararEvo();//esta linea es importante
    this.blockUI.start('Cargando datos...');
    this.crearFormulario();
    const tipo: string = sessionStorage.getItem('Tipo').toString();
    this.getCatalogoServicios(tipo);
    const entity = JSON.parse(sessionStorage.getItem('shoppingCart'));
    if (entity) {
      console.log(entity);
      this.forma.patchValue(entity.forma);
      this.getDescuentos(entity.forma.descuento || null);
      entity.detalles.map(det => {
        const element = this.fb.group({ ...this.detalle });
        element.patchValue(det);
        this.arreglo.push(element);
      })
    } else {
      this.getDescuentos(null);
      this.forma.controls['referencia'].setValue(await this.getReferencia());
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

  limpiarCamposDescuento() {
    this.forma.controls['descuento'].setValue('');
    this.forma.controls['dsctodescrip'].setValue('');
  }

  buscarServicio() {
    const filter = this.forma.get('servicio').value?.toUpperCase() || '';
    if (filter === '') {
      this.deseleccionarServicio();
    } else {
      this.filteredCatalogoServicios = this.catalogoPagoTipoUser.filter(item =>
        item.descripcion.toUpperCase().includes(filter) ||
        item.concepto.toUpperCase().includes(filter)
      );
    }
  }

  validarServicio() {
    if (this.filteredCatalogoServicios?.length === 0) this.limpiarCamposServicio();
  }

  deseleccionarServicio() {
    this.forma.get('servicio').setValue('');
    this.limpiarCamposServicio();
    this.filteredCatalogoServicios = this.catalogoPagoTipoUser;
  }

  limpiarCamposServicio() {
    this.forma.get('idingreso').setValue('');
    this.forma.get('punit').setValue('');
    this.forma.get('cambiaPrecio').setValue('N');
    this.forma.get('cantidad').setValue(1);
  }

  seleccionarServicio(event: MatAutocompleteSelectedEvent) {
    let value: CatalogoPagoTipoUser = event.option.value;
    this.limpiarCamposServicio();
    this.forma.get('servicio').setValue(value.descripcion);
    this.forma.get('idingreso').setValue(value.concepto);
    this.forma.get('punit').setValue(parseFloat(value.punit).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    this.forma.get('paquete').setValue(value.paquete);
    if (parseFloat(value.punit) === 1) this.forma.get('cambiaPrecio').setValue('S');
    this.buscarServicio();
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
      const element = this.fb.group({ ...this.detalle });
      let id = this.forma.get('idingreso').value;
      let encontrada = this.Detalles.find(a => a.get('idingreso').value === id);
      let cant = parseInt(this.forma.get('cantidad').value);
      let punit = parseFloat(this.forma.get('punit').value.toString().replace(/,/g, ''));
      if (encontrada) {
        let cantactual = parseInt(encontrada.controls['cantidad'].value);
        encontrada.controls['cantidad'].setValue(cantactual + cant);
        encontrada.controls['subtotal'].setValue((cantactual + cant) * punit);
      } else {
        element.controls['idingreso'].setValue(id);
        element.controls['concepto'].setValue(this.forma.get('servicio').value);
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
      cantidad: [1, [Validators.required, Validators.max(999), Validators.min(1)]],
      punit: ['', [Validators.required, Validators.max(99999), Validators.min(0.01)]],
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
      }
    });

    const entity = {
      usuaid: this.forma.get('user').value,
      montoapagar: this.forma.get('total').value,
      referencia: this.forma.get('referencia').value,
      concepto: "PAGO DE " + (this.forma.get('nombre').value || this.forma.get('user').value) + " REF: " + this.forma.get('referencia').value + " FOLIO: ",
      user: this.forma.get('user').value || null,
      detalle: detalle
    }
    sessionStorage.removeItem("shoppingCart");
    sessionStorage.shoppingCart = JSON.stringify({ forma: this.forma.getRawValue(), detalles: this.arreglo.getRawValue() });
    // let total = this.forma.get('total').value;

    this.mostrarEvo(entity)
  }


  mostrarEvo(entity: any) {
    const referencia = this.forma.get('referencia').value;
    this._evo.getEvo(entity).subscribe({
      next: (response: any) => {
        this.blockUI.stop();
        console.warn('response', response)
        this.session_id = response.session_id;
        this.successIndicator = response.successIndicator;
        sessionStorage.MasterID = referencia;
        //    this.clearHostedCheckoutSessionStorage();
        this.showEvoOverlay();
        setTimeout(() => {
          try {
            const checkout: EvoCheckout | any = (window as any).Checkout;
            if (!checkout) {
              throw new Error('El SDK de Checkout no está cargado.');
            }
            checkout.configure({
              session: {
                id: response.session_id
              },
            });
            setTimeout(() => {
              //checkout.showPaymentPage();
              // checkout.showLightbox();
              if (checkout) {
                this.startPolling(referencia)
                checkout.showEmbeddedPage('#evo-embed-container');
              }
              //checkout.showEmbeddedPage('#evo-embed-container');
            }, 700);

            console.log(checkout);
          } catch (e) {
            console.error('Error invocando showEmbeddedPage:', e);
            this.ngZone.run(() => this.handleError(e));
            this.closeEvoModal();
          }
        }, 2000); // 200ms es suficiente si el overlay ya está visible

      },
      error: (e) => {
        this.blockUIService.stop('global');
        console.error('e.getEvo', e)
        Swal.fire({
          title: 'ERROR!!!',
          text: JSON.stringify(e),
          icon: 'error'
        });
      },
      complete: () => {
        console.log('complete')
        this.blockUIService.stop('global');
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
    void overlay.offsetHeight;
  }

  // Cerrar
  public closeEvoModal(event?: Event): void {
    this.blockUI.stop();
    if (event) event.stopPropagation();
    const overlay = document.getElementById('evo-embed-overlay') as HTMLElement;
    if (overlay) overlay.classList.remove('open');
    const container = document.getElementById('evo-embed-container');
    if (container) container.innerHTML = '';
    document.body.style.overflow = '';
    this.clearHostedCheckoutSessionStorage();
  }

  getCatalogoServicios(tipo: string) {
    this._cp.getCatalogoPagoTipoUser(tipo).subscribe(
      (catalogoPagoTipoUser) => {
        this.catalogoPagoTipoUser = catalogoPagoTipoUser;
        this.filteredCatalogoServicios = catalogoPagoTipoUser;
      }
    )
  }

  getDescuentos(id: string) {
    this._ds.getDescuento().subscribe((descuentos) => {
      if (descuentos.length != 0) {
        this.descuentos = descuentos
        this.llenarDescuento(id);
      }
    })
  }

  llenarDescuento(id: string) {
    const encontrada = this.descuentos.find(s => s.vdes_foldescto?.toString() === id?.toString());
    if (encontrada) {
      this.forma.controls['dsctodescrip'].setValue(encontrada);
    }
  }

  async getReferencia(): Promise<string> {
    const ref = await this._ps.getTsqpagosonline().toPromise();
    return ref as string;
  }
  /*cosas que agrugué JCMH*/
  private pollingSubscription?: Subscription;

  private startPolling(referencia: string): void {
    this.stopPolling();

    this.pollingSubscription = interval(10000)
    .pipe(
      switchMap(() =>
        this._evo.retrieveInfo(referencia).pipe(
          catchError(error => {
            console.error('Error consultando la transacción; se volverá a intentar:', error);
            return EMPTY;
          })
        )
      ),
      takeUntil(timer(10 * 60 * 1000))
    )
      .subscribe({
        next: (response: any) => {
          console.log('Estado de la transacción:', response);

          // Sustituye esta condición por el campo/estados que devuelve tu API.
          if (response && this.transaccionTerminada(response)) {
            //sessionStorage.removeItem("MasterID");
            // sessionStorage.removeItem("shoppingCart");
            this.stopPolling();
          }
        },
        error: (error) => {
          console.error('Error consultando la transacción:', error);
          this.stopPolling();
        }
      });
  }
  private transaccionTerminada(response: any): boolean {
    // console.info('estado de la trans terminada', response)
    return response.status === 'CAPTURED';
  }
  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }



  // @HostListener('window:pagehide', ['$event'])
  // onPageHide(event: PageTransitionEvent): void {
  //   alert('usuario saliendo de la página')
  //   console.log('La página está saliendo o entrando en BFCache', {
  //     persisted: event.persisted
  //   });
  // }
  @HostListener('window:pageshow', ['$event'])
  onPageShow(event: PageTransitionEvent): void {
    if (event.persisted) {
      console.log('La página fue restaurada desde BFCache');
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

}
