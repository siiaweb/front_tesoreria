import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { ListaUsuariosService } from '../../services/dashboard/listausuarios/listausuarios.service';
import { Subscription } from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Tvusuario } from '../../services/dashboard/listausuarios/tvusuario';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule,MatDialogRef,MatFormFieldModule,MatInputModule} from '@angular/material';
/* import {MatDialog, MatDialogModule,MatFormFieldModule,MatInputModule,FormsModule,NgIf} from '@angular/material/dialog'; */
import {MatButtonModule} from '@angular/material/button';
import swal from 'sweetalert2';

export interface DialogData {
  id: string;
  password: string;
}

 @Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.scss'],
  
})
 

export class ResetpassComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static:false}) sort: MatSort;

  displayedColumns: string[] = ['userid','persona','nombre','usuario','telefono','email','tipo_usuario','unidad_responsable','reset_pass'];
  public dataSource = new MatTableDataSource<Tvusuario>();
  //dataSource: any;

  private subscription: Subscription;
   name: any;
   animal: any;
  //tvusuario: Tvusuario[];

  constructor( private _lu: ListaUsuariosService,public dialog: MatDialog) { }

  ngOnInit() {

    this.subscription = this._lu.getListaUsuariosFiltro().subscribe(
      (tusuario) => {
        //this.tvusuario = tvusuario;
        this.dataSource.data = tusuario as any[];
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

  ActPass(data:DialogData){
    //console.log(data);
  }

  openDialog(id:number): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      height: '300px',
      width: '305px',
      data: {id: id,password:''},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  

}

@Component({
  selector: 'x',
  templateUrl: 'x.html',

})
export class DialogOverviewExampleDialog {
  datos:DialogData[];
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private _lu: ListaUsuariosService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ActPass(data:DialogData){
   // console.log(data);
      this._lu.updatePassword(data).subscribe(
      (dato)=>{
        if(dato){
          swal.fire('Password Actualizado', `Su password se actualizo correctamente`, 'success');
        }
        else{
          swal.fire('Algo salio mal', `Su usuario o email son incorrectos o no existen`, 'error');
        }
        
      }

      ); 
  }
}