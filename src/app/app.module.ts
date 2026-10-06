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
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';

import localeEsMx from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEsMx, 'es-Mx');
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {NgxPaginationModule} from 'ngx-pagination';
import { SettingsComponent } from './modules/settings/settings.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReceiptComponent } from './modules/receipt/receipt.component';
import { PostsComponent } from './modules/posts/posts.component';


@NgModule({
    declarations: [
        AppComponent,
        SettingsComponent,
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
        MatProgressBarModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        FlexLayoutModule,
        MatTableModule,
        MatDialogModule,
        NgbModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'es-MX' }, 
        //{ provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
