import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { Roles } from '../../../services/dashboard/roles';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  roles:Roles[];
  tipoRol: any;

  constructor( private _das: DashboardService ) { }

  ngOnInit() {
    /*
    this._das.getRol(sessionStorage.getItem('Tipo')).subscribe(
      (roles) => {
        this.roles = roles;
        console.log(this.roles);
      }
    )
      */
     this.tipoRol = sessionStorage.getItem('Tipo');
     //console.log(this.tipoRol);
  }

}
