import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import config from 'src/resources/endpoints';
import { TipoDenunciaModel } from 'src/resources/models/TipoDenuncia.model';
import { ReceptorModel } from 'src/resources/models/Receptor.model';
import { RelacionEmpresaModel } from 'src/resources/models/RelacionEmpresa.model';

@Injectable({
  providedIn: 'root'
})
export class FormularioDenunciaService {
  private apiUrl: string = `${config.URL}/CanalDenuncias`;
  private apiUrlDenuncia: string = `${config.URL}/Denuncia`;

  private TipoDenunciaUrl: TipoDenunciaModel[] = [];
  private ReceptorUrl: ReceptorModel[] = [];
  private RelacionEmpresaUrl: RelacionEmpresaModel[] = [];

  private formData: { [key: string]: any } = {};

  constructor(private http: HttpClient) { }

  // POST
  sendData(data: any): Observable<object> {
    const headers = new HttpHeaders({
      'XSRF-TOKEN': '2XJ34B48FM39ASF909SDGDSG'
    });

    return this.http.post(`${this.apiUrlDenuncia}/PostAddDenuncia`, data, { headers })
      .pipe(
        map((response: any) => {
          return { success: response.codEstado > 0, codigo: `DENUNCIA_${response.codEstado}` };
        })
      );
  }


  // GET
  getFinData(): Observable<any> {
    const receptores$ = this.http.get<ReceptorModel[]>(`${this.apiUrl}/recepcion?IDEMPRESA=${config.IDEMPRESA}&CESTDO=A&start=0&length=1000`)
      .pipe(
        map((response: any) => {
          const data = response?.data?.length ? response.data : [];
          this.setReceptorUrl(data);
          return data;
        })
      );
  
    const tipoDenuncia$ = this.http.get<TipoDenunciaModel[]>(`${this.apiUrl}/tipo-denuncia?IDEMPRESA=${config.IDEMPRESA}&TIPO=1&CESTDO=A&start=0&length=1000`)
      .pipe(
        map((response: any) => {
          const data = response?.data?.length ? response.data : [];
          this.setTipoDenunciaUrl(data);
          return data;
        })
      );

    const relacionEmpresa$ = this.http.get<RelacionEmpresaModel[]>(`${this.apiUrl}/tipo-denuncia?IDEMPRESA=${config.IDEMPRESA}&TIPO=2&CESTDO=A&start=0&length=1000`)
      .pipe(
        map((response: any) => {
          const data = response?.data?.length ? response.data : [];
          this.setRelacionEmpresaUrl(data);
          return data;
        })
      );
  
    return forkJoin([receptores$, tipoDenuncia$, relacionEmpresa$]);
  }
  


  getReceptorUrl(cadena: string): ReceptorModel[] {
    if(cadena) {
      return this.ReceptorUrl.filter((rec: any) => rec["didrol"] == cadena);
    }
    return this.ReceptorUrl;
  }

  setReceptorUrl(receptorUrl: ReceptorModel[]) {
    this.ReceptorUrl = receptorUrl;
  }

  getTipoDenunciaUrl(): TipoDenunciaModel[] {
    return this.TipoDenunciaUrl;
  }

  setTipoDenunciaUrl(tipoDenunciaUrl: TipoDenunciaModel[]) {
    this.TipoDenunciaUrl = tipoDenunciaUrl;
  }


  getRelacionEmpresaUrl(): RelacionEmpresaModel[] {
    return this.RelacionEmpresaUrl;
  }

  setRelacionEmpresaUrl(relacionEmpresaUrl: RelacionEmpresaModel[]) {
    this.RelacionEmpresaUrl = relacionEmpresaUrl;
  }

  setFormData(step: string, data: any) {
    this.formData[step] = data;
  }

  getFormData(step: string): any {
    return this.formData[step] || null;
  }

  getFormDataAll(): { [key: string]: any } {
    return this.formData;
  }

  clearFormData() {
    this.formData = {};
  }

}