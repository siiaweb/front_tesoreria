import { Component, OnInit } from '@angular/core';
import { Tnoticias } from '../../../services/dashboard/noticias/tnoticias';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NoticiasService } from '../../../services/dashboard/noticias/noticias.service';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-newform',
  templateUrl: './newform.component.html',
  styleUrls: ['./newform.component.scss']
})
export class NewformComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public urlEndPoint: string = `${environment.rutaAPI}`;

  forma: FormGroup;
  tnoticia:Tnoticias[];

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

  constructor( private fb: FormBuilder, private _ns: NoticiasService, public router: Router,
               private activatedRoute: ActivatedRoute, private http: HttpClient ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
      this.acc = params['acc']
      console.log(this.acc);
      if (this.id !== 0){
        this.subscription = this._ns.getNoticia(this.id).subscribe(
          (noticia) => {
            this.tnoticia = noticia;
            this.forma.patchValue(this.tnoticia[0]);
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
      /*
      this.afuConfig = {
        multiple: false,
        formatsAllowed: ".jpg,.jpeg",
        maxSize: "10",
        uploadAPI:  {
          url:`${environment.rutaAPI}/uploadFile/`,
          method:"POST
        },
        hideResetBtn: true,
        //theme: "dragNDrop",
        replaceTexts: {
          selectFileBtn: 'Seleccionar archivo',
          uploadBtn: 'Sibur Imagenes',
          dragNDropBox: 'Drag N Drop',
          attachPinBtn: 'Adjuntar archivos...',
          afterUploadMsg_success: 'Cargado correctamente !',
          afterUploadMsg_error: 'Subida fallida !',
          sizeLimit: 'Límite de tamaño'
        }
      };
      */
    }
    
  }

  get tituloNovalido(){
    return this.forma.get('tnot_titulo').invalid && this.forma.get('tnot_titulo').touched
  }

  get fechaNovalido(){
    return this.forma.get('tnot_fecha').invalid && this.forma.get('tnot_fecha').touched
  }

  get notaNovalido(){
    return this.forma.get('tnot_nota').invalid && this.forma.get('tnot_nota').touched
  }

  crearFormulario(){
    this.forma = this.fb.group({
      tnot_titulo: ['', [Validators.required,Validators.maxLength(200)]],
      tnot_fecha: ['', Validators.required],
      tnot_nota: ['', [Validators.required,Validators.maxLength(4000)]],
      tnot_ruta_img: ['no_image.png', Validators.required],
      tnot_autor: [sessionStorage.getItem('Login'), Validators.required],
      tnot_estatus: ['A', Validators.required]
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
      this._ns.create(this.forma.value).subscribe(master => {
        this.blockUI.stop();
        this.router.navigate(['/noticias']);
        Swal.fire({icon: 'success',title: 'Noticia Guardada',showConfirmButton: false,timer: 3000});
      },
      error => {
        console.log(error);
        this.blockUI.stop();
        Swal.fire({
          title: 'ERROR!!!',
          text: error.error.message,
          icon: 'error'});
      })
    }
  }

  update(id){
    this.blockUI.start();
    this._ns.update(id,this.forma.value).subscribe(master => {
      this.blockUI.stop();
      this.router.navigate(['/noticias']);
      Swal.fire({icon: 'success',title: 'Noticia Actualizada',showConfirmButton: false,timer: 3000});
    },
    error => {
      console.log(error);
      this.blockUI.stop();
      Swal.fire({
        title: 'ERROR!!!',
        text: error.error.message,
        icon: 'error'});
    })
  }

  DocUpload(event){
    console.log(event);
  }

  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
    this.ToggleButton = false;
  }

  onUpload(){
    this.blockUI.start();
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.http.post(`${this.urlEndPoint+"/uploadFile/"+this.id+"/tnoticias"}`,fd,{
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
            this.router.navigate(['/noticias']);
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
        Swal.fire({
          title: 'ERROR!!!',
          text: error.message,
          icon: 'error'});
      });
      this.ToggleButton = true;
  }

}
