import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReceiptComponent } from '../receipt/receipt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import {NgxPaginationModule} from 'ngx-pagination';
import { PAGES_ROUTES } from './default.routes';
import { DialogOverviewExampleDialog } from '../resetpass/resetpass.component';
import { DiscountComponent } from '../discount/discount.component';
import { MaterialModule } from 'src/app/shared/material.module';

@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    PostsComponent,
    ReceiptComponent,
    DialogOverviewExampleDialog  ,   
    DiscountComponent,
  ],
  entryComponents: [DialogOverviewExampleDialog],
  exports: [
    DefaultComponent,
    
  ],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    SharedModule,
    FlexLayoutModule,
    PAGES_ROUTES,
    FormsModule, 
    ReactiveFormsModule,
    BlockUIModule.forRoot(),
    NgxPaginationModule,
    
  ],
  providers: [
    
  ]
})
export class DefaultModule { }
