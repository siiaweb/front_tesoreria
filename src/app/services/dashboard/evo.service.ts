import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment, } from '../../../environments/environment';
import { catchError, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Subscription, interval, EMPTY, timer } from 'rxjs';
import { Router } from '@angular/router';
import { BlockUIService } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { EvoCheckout } from 'src/app/modules/shoppingcart/shoppingcart.component';


@Injectable({
  providedIn: 'root'
})
export class EvoService {
  private pollingSubscription?: Subscription;
  public urlEndPoint = `${environment.rutaAPI}`;

  constructor(
    private http: HttpClient,
    public router: Router,
    private blockUIService: BlockUIService) { }
  

  public stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

  handleCompletado(resultIndicator: string, sessionVersion: string, referencia: string) {
    this.stopPolling();
    console.log('Pago completado con éxito:', resultIndicator);
    console.log('sessionVersion', sessionVersion)
    console.log('referencia', referencia)
    //alert('pago completado ' + referencia)
    this.insertarRespuestaConPdf(referencia, resultIndicator)
      .subscribe({
        next: (response) => {
          const disposition = response.headers.get('Content-Disposition');
          console.log('Content-Disposition recibido:', response.headers.get('Content-Disposition'));
          const coincidencia = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
          let nombre = coincidencia && coincidencia[1]
            ? coincidencia[1].replace(/"/g, '')
            : 'reporte.pdf';
          try {
            nombre = decodeURIComponent(nombre);
          } catch {
            // Conserva el nombre original si no tiene codificación URL válida.
          }
          sessionStorage.removeItem("MasterID");
          sessionStorage.removeItem("shoppingCart");
          const blob = new Blob([response.body], { type: 'application/pdf' });
          if (!blob) {
            console.error('La respuesta no contiene el PDF.');
            return;
          }
          const url = URL.createObjectURL(blob);
          const enlace = document.createElement('a');
          enlace.href = url;
          enlace.download = decodeURIComponent(nombre);
          document.body.appendChild(enlace);
          enlace.click();
          enlace.remove();

          setTimeout(() => URL.revokeObjectURL(url), 1000);
         // this.closeEvoModal();

          this.router.navigate(['/recibos'], {
            queryParams: { resultIndicator, sessionVersion }
          }).then(navigated => {
            console.log('Navegación completada:', navigated);
           // this.cdr.detectChanges();
           if(navigated){
            window.location.reload();
           }
          }).catch(error => {
            console.error('Error de navegación:', error);
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

 public showEvoOverlay(): void {
    const overlay = document.getElementById('evo-embed-overlay') as HTMLElement;
    if (!overlay) { console.error('Overlay no encontrado'); return; }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // forzar reflow para evitar problemas de stacking
    void overlay.offsetHeight;
  }

    public closeEvoModal(event?: Event): void {
    if (event) event.stopPropagation();
    const overlay = document.getElementById('evo-embed-overlay') as HTMLElement;
    if (overlay) overlay.classList.remove('open');
    const container = document.getElementById('evo-embed-container');
    if (container) container.innerHTML = '';
    document.body.style.overflow = '';
    //this.clearHostedCheckoutSessionStorage();
  }

   mostrarEvo(total:number,entity:any) {//(this.ID, this.total)
   
    //let referencia = this.forma.get('referencia').value;
    
    return this.getEvo(total, entity).pipe(
      map(response=>{
        //this.blockUIService.stop('global');
        console.warn('response', response)
        sessionStorage.MasterID = response.referencia;
       
        //this.pago_referencia.setValue(response.referencia);
       
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
              if (checkout) {
                this.startPolling(response.referencia)
                checkout.showEmbeddedPage('#evo-embed-container');
              }
              //checkout.showEmbeddedPage('#evo-embed-container');
            }, 700);

            console.log(checkout);
          } catch (e) {
            console.error('Error invocando showEmbeddedPage:', e);
            Swal.fire({ title: 'AVISO!!!', text: JSON.stringify(e), icon: 'error' });
            this.closeEvoModal();
          }
        }, 2000); // 200ms es suficiente si el overlay ya está visible
        return response;
    })
  )
    
  
  }

  public startPolling(referencia: string): void {
    this.stopPolling();
    this.pollingSubscription = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.retrieveInfo(referencia).pipe(
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
    return response.status === 'CAPTURED';
  }
  //----------------------------------------------------------


  getEvo(amount: number, entity: any):Observable<any> {

    return this.http.post(`${this.urlEndPoint}/evo/${amount}`, entity);
    //return this.http.get(this.urlEndPoint + '/evo/'+referencia+'/'+mount,entity);
  }

  retrieveInfo(referencia: string) {
    return this.http.get(`${this.urlEndPoint}/evo/callback/${referencia}`)
  }

  insertarRespuesta(referencia: string, resultIndicator: string) {
    let params = new HttpParams();
    params = params.append('resultIndicator', resultIndicator);
    return this.http.post(`${this.urlEndPoint}/evo/trespbanco/${referencia}`, {}, { params })
  }

  insertarRespuestaConPdf(
    referencia: string,
    resultIndicator: string
  ): Observable<HttpResponse<ArrayBuffer>> {
    const params = new HttpParams()
      .set('resultIndicator', resultIndicator);

    const httpOptions: {
      params: HttpParams;
      responseType: 'arraybuffer';
      observe: 'response';
    } = {
      params,
      responseType: 'arraybuffer',
      observe: 'response'
    };

    return this.http.post(
      `${this.urlEndPoint}/evo/respuesta/${referencia}`,
      {},
      httpOptions
    );
  }

}
/*
  getPDF(referencia: string): Observable<any> {
    return this.http.get(
      `${this.urlEndPoint}/pdf/${encodeURIComponent(referencia)}`,
      {
    
    responseType: 'blob'
  }
    );
    */





