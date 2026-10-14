import { UntypedFormArray, UntypedFormGroup } from "@angular/forms";
import Swal from "sweetalert2";

export interface tipoMensaje {
  statusCode?: string;
  mensajeUsuario: string;
  mensajeTecnico?: string;
}

export class erroresFormulario{

    static traerErroresFormularios(form: UntypedFormGroup, arreglo: UntypedFormArray | null = null, campos: Record<string, string> = {}): string{        
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
                  const filaGroup = fila as UntypedFormGroup;
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
        fieldsDoNotMatch: `No coincide con ${errorValue.field}`,
        email: `Necesita tener formato de correo.`,
        pattern: `El formato no es correcto.`
      };
      return messages[errorKey] || `Error de validación: ${errorKey}`;
    }

    static handleErrorMessageVentana(errorResponse: any) {
      console.error('errorMsg', errorResponse)
      let err: tipoMensaje;
      if (!errorResponse.error) {
        err = {
          statusCode: '500',
          mensajeUsuario: JSON.stringify(errorResponse),
          mensajeTecnico: JSON.stringify(errorResponse)
        };
      } else {
        err = {
          statusCode: errorResponse?.error?.statusCode,
          mensajeUsuario: errorResponse?.error?.message,
          mensajeTecnico: errorResponse?.error?.mensaje_tecnico
        };
      }
  
  
      let messageUsuario = err.mensajeUsuario?.replace(/"/g, "");
      messageUsuario = messageUsuario?.replace(/'/g, "");
      messageUsuario = messageUsuario?.replace(/\n/g, " ");
  
      let messageTecnico = err.mensajeTecnico ? err.mensajeTecnico?.replace(/"/g, "") : err.mensajeUsuario?.replace(/"/g, "");
      messageTecnico = messageTecnico?.replace(/'/g, " ");
      messageTecnico = messageTecnico?.replace(/\n/g, " ");
  
      return Swal.fire({
        title: '¡AVISO!',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        html: err.mensajeTecnico !== '' && err.mensajeTecnico !== null && err.mensajeTecnico !== undefined ?
          `<body>
                            <div id="info" style='width=100%; margin-bottom: 20px;'>
                                ${messageUsuario}
                            </div>
    
                            <button 
                                style='
                                    width: 150px;
                                    background-color: #E9EDF1;
                                    color: #000;
                                    height: 40px;
                                    border-radius: .25em;
                                    border-color: #E9EDF1;
                                    border: 0;
                                    box-shadow: none;
                                    font-size: 1em;
                                    padding: 0px 10px;
                                '
                                onclick='{
                                    document.getElementById("info").textContent = "${messageUsuario}";
                                }'
                            >
                                Mensaje
                            </button>
    
                            <button 
                                style='
                                    width: 150px;
                                    background-color: #E9EDF1;
                                    color: #000;
                                    height: 40px;
                                    border-radius: .25em;
                                    border-color: #E9EDF1;
                                    border: 0;
                                    box-shadow: none;
                                    font-size: 1em;
                                    padding: 0px 10px;
                                '
                                onclick='{
                                    document.getElementById("info").textContent = "${messageTecnico}";
                                }'
                            >
                                Error Técnico
                            </button>
                        </body>`
          :
          `<body>
                            <div id="info" style='width=100%; margin-bottom: 20px;'>
                                ${messageUsuario}
                            </div>
                        </body>`
  
      });
    }
}