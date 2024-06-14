import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';
import { RegistrarService } from 'src/app/services/services.index';
import { Ttipouser } from './ttipouser';
import { Tnivelures } from './tnivelures';
import { Ures } from './ures';
import { Programas } from './programas';
import {Router, ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { sha256, sha224 } from 'js-sha256';
import { ErroresService } from '../../services/manejo_errores/errores.service';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html'
})
export class RegistrarComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  forma: FormGroup;

  private subscription: Subscription;

  isHidden = true;
  isHiddenMatricula = false;

  ttipouser:Ttipouser[];
  tnivelures:Tnivelures[];
  ures:Ures[];
  programas: any[];

  constructor( private fb: FormBuilder, private validadores: ValidadoresService, private _reg: RegistrarService,
               public router: Router, private _error: ErroresService ) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.blockUI.start();
    this.crearFormulario();

    this._reg.getTtipouser().subscribe(
      (ttipouser) => {
        this.ttipouser = ttipouser;
        //console.log(this.ttipouser);
      }
    )

    this._reg.getTnivelures().subscribe(
      (tnivelures) => {
        this.tnivelures = tnivelures;
        //console.log(this.tnivelures);
      }
    )

    this._reg.getUres().subscribe(
      (ures) => {
        this.ures = ures;
        //console.log(this.ures);
      }
    )
    this.blockUI.stop();
  }

  Programas(valueUres){
    //console.log(valueUres);
    this._reg.getPrograma(valueUres).subscribe(
      (programas: any) => {
        this.programas = programas;
        //console.log(this.programas);
      }
    )
  }

  Hidden(ValorSelect){
    if (ValorSelect=="10" || ValorSelect=="20" || ValorSelect=="30"){
      this.isHidden = false;

      this.forma.get('usua_ures').setValue('');
      this.forma.get('usua_ures').setValidators(Validators.required);
      this.forma.get('usua_ures').updateValueAndValidity();

      this.forma.get('usua_nivel').setValue('');
      //this.forma.get('usua_nivel').setValidators(Validators.required);
      this.forma.get('usua_nivel').updateValueAndValidity();

      this.forma.get('usua_prog').setValue('');
      this.forma.get('usua_prog').clearValidators();
      this.forma.get('usua_prog').updateValueAndValidity();
    }else{
      this.isHidden = true;

      this.forma.get('usua_ures').setValue('5300');
      this.forma.get('usua_ures').clearValidators();
      this.forma.get('usua_ures').updateValueAndValidity();

      this.forma.get('usua_nivel').setValue('40');
      //this.forma.get('usua_nivel').clearValidators();
      this.forma.get('usua_nivel').updateValueAndValidity();
      
      this.Programas('5300');

      this.forma.get('usua_prog').setValue('510002');
      this.forma.get('usua_prog').clearValidators();
      this.forma.get('usua_prog').updateValueAndValidity();
    }

    if (ValorSelect=="50"){
      this.isHiddenMatricula = true;
      this.forma.get('usua_persona').setValue('999999');
      this.forma.get('usua_persona').updateValueAndValidity();
    }else{
      this.isHiddenMatricula = false;
      this.forma.get('usua_persona').setValue('');
      this.forma.get('usua_persona').updateValueAndValidity();
    }

  }

  get tipoUsuarioNovalido(){
    return this.forma.get('usua_tipo_usuario').invalid && this.forma.get('usua_tipo_usuario').touched
  }
/*
  get nivelUresNovalido(){
    return this.forma.get('usua_nivel').invalid && this.forma.get('usua_nivel').touched
  }
*/
  get uresNovalido(){
    return this.forma.get('usua_ures').invalid && this.forma.get('usua_ures').touched
  }

  get userNovalido(){
    return this.forma.get('usua_usuario').invalid && this.forma.get('usua_usuario').touched
  }

  get matriculaNovalido(){
    return this.forma.get('usua_persona').invalid && this.forma.get('usua_persona').touched
  }

  get nombreNovalido(){
    return this.forma.get('usua_nombre').invalid && this.forma.get('usua_nombre').touched
  }

  get telefonoNovalido(){
    return this.forma.get('usua_tel').invalid && this.forma.get('usua_tel').touched
  }

  get emailNovalido(){
    return this.forma.get('usua_email').invalid && this.forma.get('usua_email').touched
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
      usua_tipo_usuario: ['', Validators.required],
      usua_nivel: [''],
      //usua_ures: ['', [Validators.required, this.validadores.existeUsuario]],
      usua_ures: ['', Validators.required],
      usua_prog: [''],
      usua_usuario: ['', [Validators.required,Validators.maxLength(20)]],
      usua_persona: ['', [Validators.required,Validators.maxLength(10)]],
      usua_nombre: ['', [Validators.required,Validators.maxLength(100)]],
      usua_tel: ['', [Validators.required,Validators.maxLength(10),Validators.pattern(/^[0-9]\d*$/)]],
      usua_email: ['', [Validators.required,Validators.email,Validators.maxLength(50)]],
      usua_paswd: ['', [Validators.required,Validators.maxLength(50)]],
      repassword: ['', [Validators.required,Validators.maxLength(50)]]
    },{
      validators: this.validadores.passwordsIguales('usua_paswd','repassword')
    });

  }

  guardar(){
    /*
    console.log(this.forma);
    var hash2 = sha256.update('Message to hash');
    console.log(sha256('este es un ejemplo'));
    */
    if (this.forma.invalid){
      return Object.values( this.forma.controls ).forEach( control =>{
        control.markAsTouched();
      })
    }else{
      //console.log(this.forma.value);
      this._reg.create(this.forma.value).subscribe(usr => {
        this.router.navigate(['']);
          Swal.fire('Nuevo usuario', `Usuario ${usr.usua_usuario} creado con éxito!`, 'success');
          //this.cargarUsers();
      },
      error => {
        console.log(error);
        
        var splitted = error.error.message.split("["); 
        var splitted2 = splitted[2].split("]"); 
        var constraint = splitted2[0].split("."); 
        this._error.getError(constraint[1]).subscribe(err => {
          console.log(err);
          Swal.fire({
            title: 'ERROR!!!',
            text: err[0].cerr_mensaje,
            icon: 'error'});
        })

        /*
        console.log(error);
        Swal.fire({
          title: 'ERROR!!!',
          text: error.error.message,
          icon: 'error'});
        */
      });
      
    }
    
  }

  buscaNombre(){
    if(this.forma.get('usua_tipo_usuario').value === ""){
      Swal.fire({title: 'Antes de ingresar matricula o número de persona, selecciona un tipo de usuario previamente',text: '',icon: 'warning'});
      this.forma.get('usua_persona').setValue("");
    }else{
      this.subscription = this._reg.getBuscaNombre(this.forma.get('usua_tipo_usuario').value,this.forma.get('usua_persona').value)
      .subscribe((data: any) => {
        console.log(data);
        this.forma.get('usua_nombre').setValue(data.Nombre);
        if (data.Nombre === null){
          Swal.fire({title: 'Matrícula o número de persona '+this.forma.get('usua_persona').value+' no encontrada',text:'', icon: 'error'});
          this.forma.get('usua_persona').setValue("");
        }
      }),
        error=>{
        Swal.fire({
          title: 'ERROR!!!',
          text: error.error.message,
          icon: 'error'});
      }
    }
  }

}
