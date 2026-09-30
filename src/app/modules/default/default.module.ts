import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { 
//MatFormFieldModule,
MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
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
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
    declarations: [
        DefaultComponent,
        DashboardComponent,
        PostsComponent,
        ReceiptComponent,
        DialogOverviewExampleDialog
        //NewsComponent
    ],
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
        MatDialogModule,
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
        MatSortModule,
        NgbTypeaheadModule,
        MatAutocompleteModule
    ],
    providers: []
})
export class DefaultModule { }
