import { Component, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';
import { RegistrarService } from 'src/app/services/services.index';
import { Ttipouser } from './ttipouser';
import { Tnivelures } from './tnivelures';
import { Ures } from './ures';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErroresService } from '../../services/manejo_errores/errores.service';
import { environment } from 'src/environments/environment';
import { fieldIdValidation, matchWithField } from '../dialog-body/validators/validators.dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./../login/login.component.scss']
})
export class RegistrarComponent implements OnInit {

  private route = inject(ActivatedRoute);
  tipo: string | null = null;
  titulo:string = null;

  @BlockUI() blockUI: NgBlockUI;

  forma: UntypedFormGroup;

  private subscription: Subscription;

  isHidden = true;
  isHiddenMatricula = false;

  ttipouser:Ttipouser[];
  tnivelures:Tnivelures[];
  ures:Ures[];
  filteredUres: Ures[] = [];
  programas: any[] = [];

  constructor( 
    private fb: UntypedFormBuilder, 
    private validadores: ValidadoresService, 
    private _reg: RegistrarService,
    public router: Router, 
    private _error: ErroresService 
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.tipo = this.route.snapshot.paramMap.get('tipo');
    this.setValorTitulo(this.tipo);
  }

  setValorTitulo(tipo:string){
    switch(tipo){
      case 'ALUMNOS':
        this.titulo = "Registro para Alumnos"
        this.forma.get('usua_tipo_usuario').setValue('10');
        this.getUres();
        break;
      case 'PERSONAL':
        this.titulo = "Registro para Personal UJED"
        this.forma.get('usua_tipo_usuario').setValue('20');
        this.getUres();
        break;
      case 'URESINC':
        this.titulo = "Registro para URES e Incorporadas"
        break;
      case 'PG':
        this.titulo = "Registro para Proveedores y Público General"
        this.forma.get('usua_tipo_usuario').setValue('50');
        this.forma.get('usua_ures').setValue('5300');
        this.forma.get('usua_prog').setValue('510002');
        this.forma.get('usua_persona').setValue('999999');
        break;
      default:
        Swal.fire({
          title: 'ERROR',
          text: 'Hubo un problema, intentalo de nuevo',
          icon: 'error'
        }).then((result) => {
          this.portal();
        });
        break;
    }
  }

  Programas(valueUres){
    this._reg.getPrograma(valueUres).subscribe(
      (programas: any) => {
        this.programas = programas;
      }
    )
  }

  cambioUresPersonal(){
    if(this.forma.get('usua_tipo_usuario').value === '30'){
      this.getUres();
      this.forma.get('usua_ures').setValue('');
      this.forma.get('usua_prog').setValue('');
    }else{
      this.forma.get('usua_ures').setValue('5300');
      this.forma.get('usua_prog').setValue('510002');
    }
  }

  buscarUres(){
    const filter = this.forma.get('ures_desc').value?.toUpperCase() || '';
    console.log(this.ures);
    if(filter === ''){
      this.deseleccionarUres();
    }else{
      this.filteredUres = this.ures.filter(item =>
        item.ures?.toString().toUpperCase().includes(filter) ||
        item.uresdesc?.toString().toUpperCase().includes(filter)
      )
      console.log(this.filteredUres);
    }
  }

  validarUres(){
    if(this.filteredUres?.length === 0) this.limpiarCamposUres();
  }

  deseleccionarUres(){
    this.forma.get('ures_desc').setValue('');
    this.limpiarCamposUres();
    this.filteredUres = this.ures;
  }

  limpiarCamposUres(){
    this.forma.get('usua_ures').setValue('');
    this.forma.get('ures_desc').updateValueAndValidity();
    this.forma.get('usua_prog').setValue('');
    this.programas = [];
  }

  seleccionarUres(event: MatAutocompleteSelectedEvent) {
    let value: Ures = event.option.value;
    this.limpiarCamposUres();
    this.forma.get('ures_desc').setValue(value.uresdesc);
    this.forma.get('usua_ures').setValue(value.ures);
    this.forma.get('ures_desc').updateValueAndValidity();
    this.buscarUres();
    this.Programas(value.ures);
  }

  updateValidity(field:string){
    this.forma.get(field).updateValueAndValidity();
  }

  togglePassword(elementId:string) {
    const input = (<HTMLInputElement>document.getElementById(elementId));
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  }


  crearFormulario(){
    this.forma = this.fb.group({
      usua_tipo_usuario: ['', Validators.required],
      usua_nivel: [''],
      usua_ures: '',
      ures_desc: ['', [Validators.required, fieldIdValidation('usua_ures')]],
      usua_prog: [''],
      usua_usuario: ['', [Validators.required,Validators.maxLength(20)]],
      usua_persona: ['', [Validators.required,Validators.maxLength(10)]],
      usua_nombre: ['', [Validators.required,Validators.maxLength(100)]],
      usua_tel: ['', [Validators.required,Validators.maxLength(10),Validators.pattern(/^[0-9]\d*$/)]],
      usua_email: ['', [Validators.required,Validators.email,Validators.maxLength(50)]],
      validemail: ['', [Validators.required,Validators.email,matchWithField('usua_email')]],
      usua_paswd: ['', [Validators.required,Validators.maxLength(50)]],
      repassword: ['', [Validators.required,Validators.maxLength(50),matchWithField('usua_paswd')]]
    });
  }

  guardar() {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
    }

    this._reg.create(this.forma.value).subscribe(
      usr => {
        this.router.navigate(['']);
        Swal.fire(
          'Nuevo usuario',
          `Usuario ${usr.usua_usuario} creado con éxito!`,
          'success'
        );
        this.forma.reset();
      },
      error => {
        console.log(error);

        // Caso específico: usuario ya existe
        if (error.error && typeof error.error === 'string' && error.error.includes('usuario ya existe')) {
          Swal.fire({
            title: 'ERROR',
            text: 'El nombre de usuario ya existe. Intenta con otro nombre.',
            icon: 'error'
          });
          return;
        }

        // Caso genérico
        Swal.fire({
          title: 'ERROR',
          text: 'Error inesperado',
          icon: 'error'
        });

      }

    );
  }


  buscaNombre(){
    if(this.forma.get('usua_tipo_usuario').value === ""){
      Swal.fire({title: 'Antes de ingresar matricula o número de persona, selecciona un tipo de usuario previamente',text: '',icon: 'info'});
      this.forma.get('usua_persona').setValue("");
    }else{
      this.subscription = this._reg.getBuscaNombre(this.forma.get('usua_tipo_usuario').value,this.forma.get('usua_persona').value)
        .subscribe((data: any) => {
          console.log(data);
          this.forma.get('usua_nombre').setValue(data.Nombre);
          if (data.Nombre === null){
            Swal.fire({title: 'Matrícula o número de persona '+this.forma.get('usua_persona').value+' no encontrada',text:'', icon: 'info'});
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

  portal(){
    window.location.href = `${environment.rutaPortal}`;
  }

  getNivelUres(){
    this._reg.getTnivelures().subscribe((tnivelures) => {
        this.tnivelures = tnivelures;
      }
    )
  }

  getUres(){
    this._reg.getUres().subscribe((ures) => {
      if(this.forma.get('usua_tipo_usuario').value === '10'){
        this.ures = ures.filter(ures => ures.tures === '1000');
        this.filteredUres = this.ures;
      }else{
        this.ures = ures;
        this.filteredUres = ures;
      }
    })
  }

}
