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
import { NoticiasService } from './dashboard/noticias/noticias.service';
import { BannersService } from './dashboard/banners/banners.service';
import { FaqsService } from './dashboard/faqs/faqs.service';
import { EquipoService } from './dashboard/equipo/equipo.service';
import { ServiciosService } from './dashboard/servicios/servicios.service';
import { PagosSiiaService } from './dashboard/pagossiia/pagossiia.service';
import { RecepcionRecibosService } from './dashboard/recepciorecibos/recepciorecibos.service';
import { ConsultaPagoRecividoService } from './dashboard/consultapagorecibido/consultapagorecibido.service';

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
    NoticiasService,
    BannersService,
    FaqsService,
    EquipoService,
    ServiciosService,
    PagosSiiaService,
    RecepcionRecibosService,
    ConsultaPagoRecividoService
  ]
})
export class ServicesModule { }
