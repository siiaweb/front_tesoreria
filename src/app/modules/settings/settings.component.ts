import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';
import { RegistrarService } from 'src/app/services/services.index';
import {Router, ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  forma: FormGroup;

  constructor( private fb: FormBuilder, private validadores: ValidadoresService, private _reg: RegistrarService,
               public router: Router ) { }

  ngOnInit() {
    this.crearFormulario();
  }

  get passwordNovalido(){
    return this.forma.get('usua_paswd').invalid && this.forma.get('usua_paswd').touched
  }

  get repasswordNovalido(){
    //return this.forma.get('repassword').invalid && this.forma.get('repassword').touched
    const pass1 = this.forma.get('usua_paswd').value;
    const pass2 = this.forma.get('repassword').value;
    
    return ( pass1 === pass2) ? false : true;
  }
  
  crearFormulario(){

    this.forma = this.fb.group({
      usua_paswd: ['', [Validators.required,Validators.maxLength(50)]],
      repassword: ['', [Validators.required,Validators.maxLength(50)]]
    },{
      validators: this.validadores.passwordsIguales('usua_paswd','repassword')
    });

  }

  guardar(){

    if (this.forma.invalid){
      return Object.values( this.forma.controls ).forEach( control =>{
        control.markAsTouched();
      })
    }else{
      //console.log(this.forma.value);
      this._reg.changePassword(this.forma.value).subscribe(usr => {
        this.router.navigate(['']);
          Swal.fire('Password Guardado', '', 'success');
          //this.cargarUsers();
      },
      error => {
        console.log(error);
          Swal.fire({
            title: 'ERROR!!!',
            text: error.error.message,
            icon: 'error'});
      });
      
    }
    
  }

}
