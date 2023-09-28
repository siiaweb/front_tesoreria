import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule, 
         MatDividerModule, 
         MatCardModule, 
         MatPaginatorModule, 
         MatTableModule,
         //MatFormFieldModule,
         MatSelectModule,
         MatButtonModule,
         MatBadgeModule,
         MatIconModule,
         MatToolbarModule,
         MatMenuModule, 
         MatDialogModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReceiptComponent } from '../receipt/receipt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import {NgxPaginationModule} from 'ngx-pagination';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';

//import { NewsComponent } from '../news/news.component';

// Rutas
import { PAGES_ROUTES } from './default.routes';
import { DialogOverviewExampleDialog } from '../resetpass/resetpass.component';

@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    PostsComponent,
    ReceiptComponent,
    DialogOverviewExampleDialog     
    //NewsComponent
  ],
  entryComponents: [DialogOverviewExampleDialog],
  exports: [
    DefaultComponent,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule, 
    MatButtonModule,
    MatBadgeModule,
    MatDialogModule ,
    MatIconModule,
    MatToolbarModule,
    PAGES_ROUTES,
    FormsModule, 
    ReactiveFormsModule,
    MatMenuModule,
    BlockUIModule.forRoot(),
    NgxPaginationModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule
  ],
  providers: [
    
  ]
})
export class DefaultModule { }
