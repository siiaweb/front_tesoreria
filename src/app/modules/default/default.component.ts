import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { LoginService } from '../../services/login.service'
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  sideBarOpen = false;

  constructor( public router: Router, private _log: LoginService ) { }

  ngOnInit() { 

    if (sessionStorage.getItem('Login') != null && sessionStorage.getItem('Tipo') != null) {
      console.log("");
    }else{
      //console.log("no deberia de entrar");
      this.router.navigate(['']);
    }

  }


  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

}
