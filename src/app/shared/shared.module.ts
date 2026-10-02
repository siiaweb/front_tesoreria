import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import {MatBadgeModule} from '@angular/material/badge';

//rutas
import { SHARED_ROUTES } from './shared.routes';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HighchartsChartModule } from 'highcharts-angular';

import { MatExpansionModule } from '@angular/material/expansion';
import { RegistrarComponent } from './registrar/registrar.component';
import { LoginComponent } from './login/login.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    RegistrarComponent,
    LoginComponent,
    DialogBodyComponent
  ],
  imports: [
    SHARED_ROUTES,
    CommonModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    HighchartsChartModule,
    MatExpansionModule,
    FormsModule, 
    ReactiveFormsModule,
    BlockUIModule.forRoot(),
    MatBadgeModule,
    NgxPaginationModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ]
})
export class SharedModule { }
