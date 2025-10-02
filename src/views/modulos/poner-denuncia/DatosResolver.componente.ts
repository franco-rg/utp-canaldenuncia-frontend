import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { FormularioDenunciaService } from "src/resources/services/modulos/poner-denuncia/formulario-denuncia.service";

@Injectable({ providedIn: 'root' })
export class DatosResolver implements Resolve<any> {
  constructor(private datosService: FormularioDenunciaService) {}

  resolve(): Observable<any> {
    return this.datosService.getFinData();
  }
}
