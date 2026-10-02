import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { LoginService } from './login.service';
import { RegistrarService } from './registrar.service';
import { ValidadoresService } from './validadores.service';
import { ErroresService } from './manejo_errores/errores.service';
import { EvoService } from './dashboard/evo.service';
import { CatalogoPagoService } from './dashboard/catalogoPago.service';
import { PagoServiciosService } from './dashboard/pagoServicios/pagoservicios.service';
import { ServiciosService } from './dashboard/servicios/servicios.service';
import { LoginGuard } from './guards/login.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    LoginGuard,
    LoginService,
    RegistrarService,
    ValidadoresService,
    ErroresService,
    EvoService,
    CatalogoPagoService,
    PagoServiciosService,
    ServiciosService,
  ]
})
export class ServicesModule { }
