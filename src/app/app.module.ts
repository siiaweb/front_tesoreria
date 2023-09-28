import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';

//rutas
import { APP_ROUTING } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { DefaultModule } from './modules/default/default.module';
import { ServicesModule } from './services/services.module';
import { ShoppingcartComponent } from './modules/shoppingcart/shoppingcart.component';
import { DiscountComponent } from './modules/discount/discount.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule,
         MatIconModule,
         MatToolbarModule,
         MatButtonModule,
         MatDialogModule,
         MatTableModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import localeEsMx from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { ListausuarioComponent } from './modules/listausuario/listausuario.component';
registerLocaleData(localeEsMx, 'es-Mx');
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {NgxPaginationModule} from 'ngx-pagination';
import { NewformComponent } from './modules/news/newform/newform.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { BannersComponent } from './modules/banners/banners.component';
import { BannerUploadComponent } from './modules/banners/banner-upload/banner-upload.component';
import { FaqsComponent } from './modules/faqs/faqs.component';
import { FaqsformComponent } from './modules/faqs/faqsform/faqsform.component';
import { TeamComponent } from './modules/team/team.component';
import { TeamformComponent } from './modules/team/teamform/teamform.component';
import { ServicesComponent } from './modules/services/services.component';
import { ServicesformComponent } from './modules/services/servicesform/servicesform.component';
import { PagossiiaComponent } from './modules/pagossiia/pagossiia.component';
import { RecepcionRecibosComponent } from './modules/recepcion-recibos/recepcion-recibos.component';
import { ConsultaPagoRecibidoComponent } from './modules/consulta-pago-recibido/consulta-pago-recibido.component';
import { DialogBodyComponent } from "./shared/dialog-body/dialog-body.component";
import { ResetpassComponent } from './modules/resetpass/resetpass.component';

@NgModule({
  declarations: [
    AppComponent,
    ShoppingcartComponent,
    DiscountComponent,
    ListausuarioComponent,
    NewformComponent,
    SettingsComponent,
    BannersComponent,
    BannerUploadComponent,
    FaqsComponent,
    FaqsformComponent,
    TeamComponent,
    TeamformComponent,
    ServicesComponent,
    ServicesformComponent,
    PagossiiaComponent,
    RecepcionRecibosComponent,
    ConsultaPagoRecibidoComponent,
    ResetpassComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTING,
    SharedModule,
    DefaultModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ServicesModule,
    BlockUIModule.forRoot(),
    NgxPaginationModule,
    AngularEditorModule,
    AngularFileUploaderModule,
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    FlexLayoutModule,
    MatTableModule,
    MatDialogModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'es-MX' }, {provide: LocationStrategy, useClass: HashLocationStrategy} ],
  bootstrap: [AppComponent],
  entryComponents: [DialogBodyComponent],
})
export class AppModule { }
