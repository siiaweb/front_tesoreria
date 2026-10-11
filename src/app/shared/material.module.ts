import { NgModule } from '@angular/core';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
//import { MatCardModule,MatIconModule,MatToolbarModule} from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
 //import {MatToolbarModule} from '@angular/material/toolbar';
// import { MatExpansionModule } from '@angular/material/expansion';
//import { MatDividerModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatListModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,  
    MatDividerModule,
    MatMenuModule,
    MatListModule,
    MatSidenavModule,
    MatProgressBarModule
  ],
  exports: [
    MatBadgeModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,  
    MatDividerModule  ,
    MatMenuModule,
    MatListModule,
    MatSidenavModule,
    MatProgressBarModule
  ]
})
export class MaterialModule {}

/*
MatFormFieldModule,
    MatInputModule,
    MatSortModule
      MatSidenavModule,
        ,
    */