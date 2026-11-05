import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

export interface BuzonDTO{
    mensaje:string;
}
@Injectable({
  providedIn: 'root'
})
export class BuzonService {
  public urlEndPoint = `${environment.rutaAPI}`;

  constructor(private http: HttpClient) { }

  guardarBuzon(entity: BuzonDTO,imagen:File) {
    const formData = new FormData();

  formData.append(
    'entity',
    new Blob(
      [JSON.stringify(entity)],
      { type: 'application/json' }
    )
  );

  formData.append('imagen', imagen);

    return this.http.post(`${this.urlEndPoint}/buzon/generar`,formData)
  }
}