export interface PagoOnline {
    pago_concepto: string;
    pago_estatus?: string;
    pago_montoapagar: number;
    pago_referencia?: string;
    pago_usuaid: string;
}

  
export interface DetPagoOnlineDTO{
    idingreso:string;
    cantidad:number;
    punit:number;
    descto?:number;
    dto_pagar?:number;
    regidescto?:number;
}
  