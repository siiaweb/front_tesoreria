import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { Roles } from '../../../services/dashboard/roles';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
 @Output() closeSidebar = new EventEmitter<void>();
  roles:Roles[];
  tipoRol: any;
onNavListClick(event: MouseEvent): void {
  if (event.target instanceof Element &&
      event.target.closest('a[mat-list-item]')) {
    this.closeSidebar.emit();
  }
}
  constructor( private _das: DashboardService ) { }

  ngOnInit() {
    
     this.tipoRol = sessionStorage.getItem('Tipo');
   
  }

}
