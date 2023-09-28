import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-banner-upload',
  templateUrl: './banner-upload.component.html',
  styleUrls: ['./banner-upload.component.scss']
})
export class BannerUploadComponent implements OnInit {

  public urlEndPoint: string = `${environment.rutaAPI}`;

  ToggleButton: boolean = true;

  id: number;
  acc: string;

  selectedFile: File = null;
  progress : any;
  mensaje : any;
  constructor( public router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
      this.acc = params['acc']
    })
  }

  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
    this.ToggleButton = false;
  }

  onUpload(){
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.http.post(`${this.urlEndPoint+"/uploadBanner/"+this.id+"/tbanners"}`,fd,{
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
            this.router.navigate(['/banners']);
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
        Swal.fire({
          title: 'ERROR!!!',
          text: error.message,
          icon: 'error'});
      });
      this.ToggleButton = true;
  }

}
