import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { 
//MatFormFieldModule,
MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReceiptComponent } from '../receipt/receipt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import {NgxPaginationModule} from 'ngx-pagination';

import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatSortModule } from '@angular/material/sort';

//import { NewsComponent } from '../news/news.component';

// Rutas
import { PAGES_ROUTES } from './default.routes';
import { DialogOverviewExampleDialog } from '../resetpass/resetpass.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

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
    ],
    providers: []
})
export class DefaultModule { }
