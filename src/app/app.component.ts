import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { LoginService } from './shared/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {


  constructor( private authService:LoginService ) {
/*
    if (sessionStorage.getItem('Login') != null) {
      console.log("si entra");
    }else{
      console.log("no deberia de entrar");
      window.location.href = `${environment.rutaPortal}`;
    }
*/
   }

  ngOnInit(): void {
     this.authService.autoLogin();
  }

}
