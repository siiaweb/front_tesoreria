import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ListaUsuariosService } from '../../services/dashboard/listausuarios/listausuarios.service';
import { Subscription } from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Tvusuario } from '../../services/dashboard/listausuarios/tvusuario';

@Component({
  selector: 'app-listausuario',
  templateUrl: './listausuario.component.html',
  styleUrls: ['./listausuario.component.scss']
})

export class ListausuarioComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;

  displayedColumns: string[] = ['userid','persona','nombre','usuario','telefono','email','tipo_usuario','unidad_responsable'];
  public dataSource = new MatTableDataSource<Tvusuario>();
  //dataSource: any;

  private subscription: Subscription;
  //tvusuario: Tvusuario[];

  constructor( private _lu: ListaUsuariosService ) { }

  ngOnInit() {

    this.subscription = this._lu.getListaUsuarios().subscribe(
      (tvusuario) => {
        //this.tvusuario = tvusuario;
        this.dataSource.data = tvusuario as Tvusuario[];
        //console.log(this.dataSource);
      }
    )

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

}
