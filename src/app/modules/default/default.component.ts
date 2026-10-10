import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../services/login.service'
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  sideBarOpen = true;

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
