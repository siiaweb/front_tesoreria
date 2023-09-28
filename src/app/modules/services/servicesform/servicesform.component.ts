import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ServiciosService } from '../../../services/services.index';
import { Tservicios } from '../../../services/dashboard/servicios/tservicios';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-servicesform',
  templateUrl: './servicesform.component.html',
  styleUrls: ['./servicesform.component.scss']
})
export class ServicesformComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public urlEndPoint: string = `${environment.rutaAPI}`;

  forma: FormGroup;
  tservicios:Tservicios[];

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

  constructor( private fb: FormBuilder, private _ss: ServiciosService, public router: Router,
    private activatedRoute: ActivatedRoute, private http: HttpClient ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
      this.acc = params['acc']
      console.log(this.acc);
      if (this.id !== 0){
        this.subscription = this._ss.getServicio(this.id).subscribe(
          (tservicios) => {
            this.tservicios = tservicios;
            this.forma.patchValue(this.tservicios[0]);
            this.forma.updateValueAndValidity();
            this.isHiddenNew = true;
            this.isHiddenUpdate = false;
          }
        )
      }
    })

    this.crearFormulario();

    if (this.acc === 'I'){
      this.uploadImage = false;
    }

  }

  get servicioNovalido(){
    return this.forma.get('tser_servicio').invalid && this.forma.get('tser_servicio').touched
  }

  get descripcionNovalido(){
    return this.forma.get('tser_descripcion').invalid && this.forma.get('tser_descripcion').touched
  }

  crearFormulario(){
    this.forma = this.fb.group({
      tser_servicio: ['', [Validators.required,Validators.maxLength(200)]],
      tser_descripcion: ['', [Validators.required,Validators.maxLength(4000)]],
      teq_ruta_img: ['no_image_service.jpg', Validators.required],
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
      this._ss.create(this.forma.value).subscribe(master => {
        this.blockUI.stop();
        this.router.navigate(['/services']);
        Swal.fire({icon: 'success',title: 'Servicio Guardado',showConfirmButton: false,timer: 3000});
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
    this._ss.update(id,this.forma.value).subscribe(master => {
      this.blockUI.stop();
      this.router.navigate(['/services']);
      Swal.fire({icon: 'success',title: 'Servicio Actualizado',showConfirmButton: false,timer: 3000});
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
    this.http.post(`${this.urlEndPoint+"/uploadFile/"+this.id+"/tservicios"}`,fd,{
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
            this.router.navigate(['/services']);
            //this.mensaje = "Archivo " +this.selectedFile.name+ " subido correctamente.";
            Swal.fire({text: "El archivo " +this.selectedFile.name+ " se subido correctamente.",icon: 'success'});
          } 
        }
        
      },
      error => {
        console.log(error);
        this.blockUI.stop();
        Swal.fire({title: 'ERROR!!!',text: error.message,icon: 'error'});
      });
      this.ToggleButton = true;
  }

}
