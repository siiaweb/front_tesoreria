import { FormArray, FormGroup } from "@angular/forms";

export class erroresFormulario{

    static traerErroresFormularios(form: FormGroup, arreglo: FormArray | null = null, campos: Record<string, string> = {}): string{        
        let htmlErrores = '<div style="text-align: left; font-size: 12px;">';
        let erroresPrincipales = '';
          Object.keys(form.controls).forEach(controlName => {
            const control = form.get(controlName);
            if(control && control.errors) {
              Object.keys(control.errors).forEach(errorKey => {
                erroresPrincipales += `<li><b>${campos[controlName]||controlName}</b>: ${this.getErrorMessage(errorKey, control.errors[errorKey])}</li>`;
              });
            }
          });
    
          if (erroresPrincipales) {
            htmlErrores += `<h5><b>Encabezado:</b></h5><ul>${erroresPrincipales}</ul>`;
          }
    
          let erroresArray = '';
          if(arreglo){
            arreglo.controls.forEach((fila, i) => {
                if (fila.invalid) {
                  let erroresFila = '';
                  const filaGroup = fila as FormGroup;
                  Object.keys(filaGroup.controls).forEach(controlName => {
                    const control = filaGroup.get(controlName);
                    if (control && control.errors) {
                      Object.keys(control.errors).forEach(errorKey => {
                        erroresFila += `<li><b>${campos[controlName]||controlName}</b>: ${this.getErrorMessage(errorKey, control.errors[errorKey])}</li>`;
                      });
                    }
                  });
        
                  if (erroresFila) {
                    erroresArray += `<p style="margin-bottom:2px; font-weight:bold; color:#d33;">Fila #${i+1}:</p><ul>${erroresFila}</ul>`;
                  }
                }
            });
          }
    
        if (erroresArray) {
          htmlErrores += `<h5 style="margin-top:5px;"><b>Detalle:</b></h5>${erroresArray}`;
        }
    
        return htmlErrores += '</div>';
    }

    private static getErrorMessage(errorKey: string, errorValue: any): string {
      const messages: Record<string, string> = {
          required: `Campo requerido.`,
          min: `Valor menor a lo permitido (${errorValue.min}).`,
          max: `Valor mayor a lo permitido (${errorValue.max}).`,
          maxlength: `Supera el número de caracteres permitidos (${errorValue.requiredLength}).`,
          isNaN: `Necesita ser valor númerico.`,
        };
        return messages[errorKey] || `Error de validación: ${errorKey}`;
    }
}