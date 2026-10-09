import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import{recuperaPass} from './recuperaPass';
import { RecuperarService } from '../../services/recuperar.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { matchWithField } from './validators/validators.dialog';
import Swal from 'sweetalert2';
import { erroresFormulario } from 'src/app/modules/componentes-genericos/manejo-errores-forma/errores';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.scss']
})
export class DialogBodyComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogBodyComponent>,
    private rec: RecuperarService,
    private router: Router,
    public fb: FormBuilder ) { }
  
  form!: FormGroup
  ngOnInit() {
    this.crearForma();
  }

  close() {
    this.dialogRef.close();
  }

  crearForma(){
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email,]],
      confemail: ['', [Validators.required, Validators.email,, matchWithField('email')]]
    })
  }

  diccionario = {
    usuario: 'Usuario',
    email: 'Correo',
    confemail: 'Validación de correo'
  }

  enviarPass() {
    if (this.form.invalid){
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Hay errores en los campos.',
        html: erroresFormulario.traerErroresFormularios(this.form, null, this.diccionario),
      });
    } 
    else{
      let recupera = {
        usua_email: this.form.get('email').value?.toUpperCase(),
        usua_usuario: this.form.get('usuario').value,
      }
      this.rec.getUsuariosEmail(recupera).subscribe(
        (dato)=>{
          if(dato.length>0){
            swal.fire('Password enviado', `Su password se envio a su correo registrado`, 'success');
            document.getElementById("cerrar").click();
          }
          else{
            swal.fire('Datos incorrectos', `Su usuario o email son incorrectos o no existen`, 'error');
          }
        }
      );
    }
  }
}
