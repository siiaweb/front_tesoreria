
export interface Carrito {
  Descrip: string;
  amount: number;
  dpago_cantidad: number;
  dpago_idingreso: string;
  dpago_punit: number;
  descto:number;
  dto_pagar:number;
  regidescto:number;
  paquete:number | null;
  importe:number;
  montoDescuento:number;
}

export interface PagoOnline {
  metodoPago: string;
  pago_concepto: string;
  pago_estatus?: string;
  pago_montoapagar: number;
  pago_referencia?: string;
  pago_usuaid: string;
  pago_foldescto?:number;
}

export interface PagoOnlineDTO{
  usuaid:string;
  concepto:string;
  montoapagar:number;
   referencia:string | null;
  user:string;
  foldescto:number;
  detalle:Array<DetPagoOnlineDTO>
}

export interface DetPagoOnlineDTO{
  idingreso:string;
  cantidad:number;
  punit:number;
  descto:number;
  dtoPagar:number;
  regidescto:number;
 
}