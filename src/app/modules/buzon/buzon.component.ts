import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BuzonService } from './buzon.service';
import { BlockUIService } from 'ng-block-ui';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buzon',
  standalone: false,
  // imports: [CommonModule],
  templateUrl: './buzon.component.html',
  styleUrls: ['./buzon.component.scss']
})
export class BuzonComponent {
  archivoImagen!: File | null;
  previewUrl: string | null = null;
  errorImagen = '';
  formulario: FormGroup = this.fb.group({
    //   asunto: ['', Validators.required],
    mensaje: ['', Validators.required],
    imagen: [null]
  });
  constructor(private fb: FormBuilder, private service: BuzonService, private blockUiService: BlockUIService) {

  }

  guardar() {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      alert('falta capturar campos')
      return;
    }
    const entity = this.formulario.getRawValue();
    const imagen: File = this.formulario.value.imagen;
    this.blockUiService.start('global', 'guardando')
    this.service.guardarBuzon(entity, imagen).subscribe({
      next: (r:any) => {
        this.blockUiService.stop('global')
        Swal.fire({
          title: 'Folio ' + r.id,
          text: 'Los datos se guardaron correctamente.',
          icon: 'success' // Puede ser: 'success', 'error', 'warning', 'info', 'question'
        }).then(result => {
          if (result.isConfirmed) {
            console.log('Guardado correctamente', r);
            this.formulario.reset();
            // Limpiar imagen y vista previa
            this.quitarImagen();
          }
        });

      },
      error: (e) => {
        this.blockUiService.stop('global')
        console.error(e)
        Swal.fire({ title: 'AVISO!!!', text: JSON.stringify(e), icon: 'error' });
      },
      complete: () => {
        this.blockUiService.stop('global')
        console.log('completed')
      }
    })


    console.log(this.formulario.value);
  }
  /**
   * 
   * @param event 
   * @returns 
   */
  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    console.log('Archivo seleccionado:', archivo);
    console.log('Tipo:', archivo.type);
    console.log('Tamaño:', archivo.size);

    this.procesarImagen(archivo);

    // Permite volver a seleccionar la misma fotografía
    input.value = '';
  }
  @HostListener('document:paste', ['$event'])
  pegarImagen(event: ClipboardEvent): void {

    const items = event.clipboardData?.items;

    if (!items) return;

    for (const item of Array.from(items)) {

      if (item.type.startsWith('image/')) {

        const archivo = item.getAsFile();

        if (archivo) {
          this.procesarImagen(archivo);
          event.preventDefault();
          return;
        }
      }
    }
  }
  /**
   * 
   * @param archivo .
   * @returns 
   */
  procesarImagen(archivo?: File): void {

    this.errorImagen = '';

    if (!archivo) {
      console.log('no tiene archivo');
      return;
    } else {
      console.log('archivo', archivo)
    }

    // Validar que sea imagen
    if (!archivo.type.startsWith('image/')) {
      alert('El archivo debe ser una imagen.')
      this.errorImagen = 'El archivo debe ser una imagen.';
      return;
    }

    // Validar tamaño máximo: 2 MB
    if (archivo.size > 10 * 1024 * 1024) {
      this.errorImagen = 'La imagen no debe superar los 2 MB.';
      return;
    }

    // Liberar preview anterior
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }

    // Guardar archivo en Reactive Form
    this.formulario.patchValue({
      imagen: archivo
    });

    this.formulario.get('imagen')?.updateValueAndValidity();

    // Crear vista previa
    this.previewUrl = URL.createObjectURL(archivo);
  }



  arrastrarImagen(event: DragEvent): void {
    event.preventDefault();
  }

  soltarImagen(event: DragEvent): void {
    event.preventDefault();

    const archivo = event.dataTransfer?.files?.[0];
    this.procesarImagen(archivo);
  }


  quitarImagen(input?: HTMLInputElement): void {

    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }

    this.previewUrl = null;
    this.errorImagen = '';

    this.formulario.patchValue({
      imagen: null
    });

    this.formulario.get('imagen')?.markAsTouched();
    this.formulario.get('imagen')?.updateValueAndValidity();

    input.value = '';
  }

  ngOnDestroy(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }

  // get asunto(){
  //   return this.formulario.controls['asunto'] as FormControl;
  // }
  get mensaje() {
    return this.formulario.controls['mensaje'] as FormControl;
  }
  /**
   *  get aspi_mun_proc(){
    return this.forma.controls['aspi_mun_proc'] as FormControl;
  }
   */
}
