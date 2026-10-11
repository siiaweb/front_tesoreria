import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
//rutas
import { SHARED_ROUTES } from './shared.routes';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AreaComponent } from './widgets/area/area.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CardComponent } from './widgets/card/card.component';
import { PieComponent } from './widgets/pie/pie.component';
import { NewsComponent } from '../modules/news/news.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { LoginComponent } from './login/login.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';
import { MaterialModule } from './material.module';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    RegistrarComponent,
    LoginComponent,
    NewsComponent,
    DialogBodyComponent
  ],
  imports: [
    SHARED_ROUTES,
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    HighchartsChartModule,
    FormsModule, 
    ReactiveFormsModule,
    BlockUIModule.forRoot(),
    NgxPaginationModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent, 
    MaterialModule
  ],
  entryComponents: [DialogBodyComponent],
})
export class SharedModule { }
