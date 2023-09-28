import { Component, OnInit } from '@angular/core';
import { Tfaqs } from '../../../services/dashboard/faqs/tfaqs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FaqsService } from '../../../services/dashboard/faqs/faqs.service';
import Swal from 'sweetalert2';
import {Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-faqsform',
  templateUrl: './faqsform.component.html',
  styleUrls: ['./faqsform.component.scss']
})
export class FaqsformComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public urlEndPoint: string = `${environment.rutaAPI}`;

  forma: FormGroup;
  tfaqs:Tfaqs[];

  isHiddenNew = false;
  isHiddenUpdate = true;

  ToggleButton: boolean = true;

  id: number;
  acc: string;

  afuConfig:any;

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

  constructor(private fb: FormBuilder, private _fs: FaqsService, public router: Router,
    private activatedRoute: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
      this.acc = params['acc']
      console.log(this.acc);
      if (this.id !== 0){
        this.subscription = this._fs.getFaq(this.id).subscribe(
          (fqas) => {
            this.tfaqs = fqas;
            this.forma.patchValue(this.tfaqs[0]);
            this.forma.updateValueAndValidity();
            this.isHiddenNew = true;
            this.isHiddenUpdate = false;
            
          }
        )
      }
    })

    window.scroll(0, 0);
    this.crearFormulario();

  }

  get preguntaNovalido(){
    return this.forma.get('faqs_pregunta').invalid && this.forma.get('faqs_pregunta').touched
  }

  get respuestaNovalido(){
    return this.forma.get('faqs_respuesta').invalid && this.forma.get('faqs_respuesta').touched
  }

  crearFormulario(){
    this.forma = this.fb.group({
      faqs_pregunta: ['', [Validators.required,Validators.maxLength(1000)]],
      faqs_respuesta: ['', [Validators.required,Validators.maxLength(4000)]],
      faqs_estatus: ['A', Validators.required]
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
      this._fs.create(this.forma.value).subscribe(master => {
        this.blockUI.stop();
        this.router.navigate(['/faqs']);
        Swal.fire({icon: 'success',title: 'FAQs Guardada',showConfirmButton: false,timer: 3000});
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
    this._fs.update(id,this.forma.value).subscribe(master => {
      this.blockUI.stop();
      this.router.navigate(['/faqs']);
      Swal.fire({icon: 'success',title: 'FAQs Actualizada',showConfirmButton: false,timer: 3000});
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
