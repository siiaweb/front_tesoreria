import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BuzonService } from './buzon.service';

@Component({
  selector: 'app-buzon',
  standalone: false,
  // imports: [CommonModule],
  templateUrl: './buzon.component.html',
  styleUrls: ['./buzon.component.scss']
})
export class BuzonComponent {
  archivoImagen!: File | null;
  formulario: FormGroup = this.fb.group({
    //   asunto: ['', Validators.required],
    mensaje: ['', Validators.required],
    imagen: [null]
  });
  constructor(private fb: FormBuilder, private service: BuzonService) {

  }

  guardar() {
    alert('guardar');
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      alert('falta capturar campos')
      return;
    }
    const entity = this.formulario.getRawValue();
    const imagen: File = this.formulario.value.imagen;

    this.service.guardarBuzon(entity,imagen).subscribe({
      next: (r) => {
        console.log('Guardado correctamente', r);
        this.formulario.reset();
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
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

  this.formulario.patchValue({
    imagen: archivo || null
  });

  this.formulario.get('imagen')?.updateValueAndValidity();

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
