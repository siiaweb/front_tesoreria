import { Component, OnInit } from '@angular/core';
import { Tequipo } from '../../../services/dashboard/equipo/tequipo';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EquipoService } from '../../../services/dashboard/equipo/equipo.service';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-teamform',
  templateUrl: './teamform.component.html',
  styleUrls: ['./teamform.component.scss']
})
export class TeamformComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public urlEndPoint: string = `${environment.rutaAPI}`;

  forma: FormGroup;
  tequipo:Tequipo[];

  isHiddenNew = false;
  isHiddenUpdate = true;
  uploadImage = true;

  ToggleButton: boolean = true;

  id: number;
  acc: string;

  afuConfig:any;

  selectedFile: File = null;
  progress : any;
  mensaje : any;

  private subscription: Subscription;

   //la configuracion de toolbarHiddenButtons, se encuentra en el archivo @kolkov/angular-editor/_ivy_ngcc_/fesm2015/kolkolv-angular-editor.js
   config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    width: 'auto',
    placeholder: 'Ingrese su texto aquí...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    enableToolbar: true,
    toolbarHiddenButtons: [
      ['justifyLeft','justifyCenter','justifyRight','justifyFull'],
      ['strikeThrough', 'superscript', 'subscript'],
      ['heading', 'fontName', 'fontSize', 'color','textColor','backgroundColor'],
      ['indent', 'outdent'],
      ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
      ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'insertOrderedList', 'insertUnorderedList'],
      ['link', 'unlink', 'insertImage', 'insertVideo','insertHorizontalRule']
    ]
  };

  constructor( private fb: FormBuilder, private _es: EquipoService, public router: Router,
    private activatedRoute: ActivatedRoute, private http: HttpClient ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
      this.acc = params['acc']
      console.log(this.acc);
      if (this.id !== 0){
        this.subscription = this._es.getEquipo(this.id).subscribe(
          (tequipo) => {
            this.tequipo = tequipo;
            this.forma.patchValue(this.tequipo[0]);
            this.forma.updateValueAndValidity();
            this.isHiddenNew = true;
            this.isHiddenUpdate = false;
            
          }
        )
      }
    })

    window.scroll(0, 0);
    this.crearFormulario();

    if (this.acc === 'I'){
      this.uploadImage = false;
    }
  }

  get nombreNovalido(){
    return this.forma.get('teq_nombre').invalid && this.forma.get('teq_nombre').touched
  }

  get puestoNovalido(){
    return this.forma.get('teq_puesto').invalid && this.forma.get('teq_puesto').touched
  }

  crearFormulario(){
    this.forma = this.fb.group({
      teq_nombre: ['', [Validators.required,Validators.maxLength(200)]],
      teq_puesto: ['', [Validators.required,Validators.maxLength(200)]],
      teq_ruta_img: ['no_imagen_team.jpg', Validators.required],
      teq_estatus: ['A', Validators.required]
    });
  }

  guardar(){
    this.blockUI.start();
    if (this.forma.invalid){
      return Object.values( this.forma.controls ).forEach( control =>{
        control.markAsTouched();
        this.blockUI.stop();
      })
    }else{
      this._es.create(this.forma.value).subscribe(master => {
        this.blockUI.stop();
        this.router.navigate(['/team']);
        Swal.fire({icon: 'success',title: 'Registro Guardado',showConfirmButton: false,timer: 3000});
      },
      error => {
        console.log(error);
        this.blockUI.stop();
        Swal.fire({title: 'ERROR!!!',text: error.error.message,icon: 'error'});
      })
    }
  }

  update(id){
    this.blockUI.start();
    this._es.update(id,this.forma.value).subscribe(master => {
      this.blockUI.stop();
      this.router.navigate(['/team']);
      Swal.fire({icon: 'success',title: 'Registro Actualizado',showConfirmButton: false,timer: 3000});
    },
    error => {
      console.log(error);
      this.blockUI.stop();
      Swal.fire({title: 'ERROR!!!',text: error.error.message,icon: 'error'});
    })
  }

  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
    this.ToggleButton = false;
  }

  onUpload(){
    this.blockUI.start();
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.http.post(`${this.urlEndPoint+"/uploadFile/"+this.id+"/tequipo"}`,fd,{
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress){
          console.log("Progreso: " + Math.round (event.loaded / event.total * 100)  + "%");
          this.progress = Math.round (event.loaded * 100 / event.total );
        }else if (event.type === HttpEventType.Response){
          console.log(event);
          if (event.status == 200){
            this.blockUI.stop();
            this.router.navigate(['/team']);
            //this.mensaje = "Archivo " +this.selectedFile.name+ " subido correctamente.";
            Swal.fire({
              title: "Subida exitosa.",
              text: "El archivo " +this.selectedFile.name+ " se subido correctamente.",
              icon: 'success'});
          } 
        }
        
      },
      error => {
        console.log(error);
        this.blockUI.stop();
        Swal.fire({title: 'ERROR!!!',text: error.message, icon: 'error'});
      });
      this.ToggleButton = true;
  }

}
