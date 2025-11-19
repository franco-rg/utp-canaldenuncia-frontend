import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import config from 'src/resources/endpoints';
import { ReceptorModel } from 'src/resources/models/Receptor.model';
import { TipoDenunciaModel } from 'src/resources/models/TipoDenuncia.model';
import { RelacionEmpresaModel } from 'src/resources/models/RelacionEmpresa.model';
import { DenunciaModel } from 'src/resources/models/Denuncia.model';

@Injectable({
  providedIn: 'root'
})
export class CanalAdminService {
  private apiUrl: string = `${config.URL}/Configuracion`;
  private apiUrlDenuncias: string = `${config.URL}/Denuncia`;
  private apiUrlUsuarios: string = `${config.URL}/Personas`;
  private apiUrlGrupoDatos: string = `${config.URL}/GrupoDato`;

  private grupoDatos: any[] = [];
  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return headers;
  }

  getDenuncias(start: number, length: number, id: number = 0): Observable<DenunciaModel[]> {
    const headers = this.getHeaders();
    let url = `${this.apiUrlDenuncias}/GetDenuncias?ID=${id}&IDEMPRESA=${config.IDEMPRESA}&CESTDO=A&start=${start}&length=${length}`;
    return this.http.get<ReceptorModel[]>(url, { headers })
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }

  getUsuario(): Observable<any> {
    const token = localStorage.getItem('token');
    const payload = token?.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload || ''));
  
    let ID = decodedPayload.nameid;
    const headers = this.getHeaders();
    let url = `${this.apiUrlUsuarios}/GetBuscar?ID=${ID}&IDEMPRESA=${config.IDEMPRESA}&CESTDO=A&start=0&length=10`;
    return this.http.get<any[]>(url, { headers })
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }


  getDashboard(): Observable<any[]> {
    const headers = this.getHeaders();
    let url = `${this.apiUrl}/GetDashboard?IDEMPRESA=${config.IDEMPRESA}`;
    return this.http.get<any[]>(url, { headers })
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }

  getFindDenuncias(start: number, length: number, id: number = 0): Observable<DenunciaModel> {
    const headers = this.getHeaders();
    let url = `${this.apiUrlDenuncias}/GetDenuncias?ID=${id}&IDEMPRESA=${config.IDEMPRESA}&CESTDO=A&start=${start}&length=${length}`;
    return this.http.get<ReceptorModel[]>(url, { headers })
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }

  getReceptores(start: number, length: number, filter: any): Observable<ReceptorModel[]> {
    let url = `${this.apiUrl}/GetReceptor?search[value]=${filter.search}&CESTDO=${filter.estado}&IDEMPRESA=${config.IDEMPRESA}&CESTDO=A&start=${start}&length=${length}`;
    return this.http.get<ReceptorModel[]>(url)
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }

  getDenuncia(start: number, length: number, filter: any): Observable<TipoDenunciaModel[]> {
    let url = `${this.apiUrl}/GetTipoDenuncia?search[value]=${filter.search}&CESTDO=${filter.estado}&TIPO=1&IDEMPRESA=${config.IDEMPRESA}&CESTDO=A&start=${start}&length=${length}`;
    return this.http.get<TipoDenunciaModel[]>(url)
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }

  getRelacionEmpresa(start: number, length: number, filter: any): Observable<RelacionEmpresaModel[]> {
    let url = `${this.apiUrl}/GetRelacionEmpresa?search[value]=${filter.search}&CESTDO=${filter.estado}&TIPO=2&IDEMPRESA=${config.IDEMPRESA}&CESTDO=A&start=${start}&length=${length}`;
    return this.http.get<RelacionEmpresaModel[]>(url)
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }

  getMedidasCautelares(start: number, length: number, filter: any): Observable<any[]> {
    let url = `${this.apiUrl}/GetRelacionEmpresa?search[value]=${filter.search}&CESTDO=${filter.estado}&TIPO=4&IDEMPRESA=${config.IDEMPRESA}&CESTDO=A&start=${start}&length=${length}`;
    return this.http.get<any[]>(url)
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }

  getRoles(start: number, length: number, filter: any): Observable<RelacionEmpresaModel[]> {
    let url = `${this.apiUrl}/GetRelacionEmpresa?search[value]=${filter.search}&CESTDO=${filter.estado}&TIPO=3&IDEMPRESA=${config.IDEMPRESA}&CESTDO=A&start=${start}&length=${length}`;
    return this.http.get<RelacionEmpresaModel[]>(url)
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }

  getUsuarios(start: number, length: number, filter: any): Observable<any[]> {
    const headers = this.getHeaders();
    let url = `${this.apiUrlUsuarios}/GetBuscar?search[value]=${filter.search}&CESTDO=${filter.estado}&TIPO=4&IDEMPRESA=${config.IDEMPRESA}&CESTDO=A&start=${start}&length=${length}`;
    return this.http.get<any[]>(url, { headers })
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }

  getParametros(start: number, length: number, filter: any): Observable<any[]> {
    let url = `${this.apiUrl}/GetParametro?search[value]=${filter.search}&CESTDO=${filter.estado}&IDEMPRESA=${config.IDEMPRESA}&start=${start}&length=${length}`;
    return this.http.get<any[]>(url)
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }

  getGrupoDatos(GDTOS: string): Observable<any[]> {
    const headers = this.getHeaders();
    let url = `${this.apiUrlGrupoDatos}/GetObtenerAll?GDTOS=${GDTOS}`;
    return this.http.get<any[]>(url, { headers })
      .pipe(
        map((response: any) => {
          this.grupoDatos = response?.data && response.data.length > 0 ? response.data : [];
          return this.grupoDatos;
        })
      );
  }

  getGrupoDatosByID(gdpdre: string): any[] {
    let FILTER: any[] = this.grupoDatos.filter((item: any) => item.gdpdre === gdpdre);
    return FILTER;
  }

  getSolicitudes(start: number, length: number, filter: any): Observable<any[]> {
    let url = `${this.apiUrl}=Solicitudes&search[value]=${filter.search}&CESTDO=${filter.estado}&IDEMPRESA=${config.IDEMPRESA}&CESTDO=A&start=${start}&length=${length}`;
    return this.http.get<any[]>(url)
      .pipe(
        map((response: any) => {
          if (response?.data && response.data.length === 0) {
            return [];
          }

          return response.data;
        })
      );
  }

  // POST
  postChatDenuncia(denuncia: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrlDenuncias}/PostAddChatDenuncia?IDEMPRESA=${config.IDEMPRESA}&CESTDO=A`;
    return this.http.post(url, denuncia, { headers })
  }

  // CONFIGURACION POST
  postAddConfiguracionDenuncia(formData: any): Observable<any> {
    formData.append('IDEMPRESA', config.IDEMPRESA);
    const headers = this.getHeaders();
    const url = `${this.apiUrl}=AddTipoDenuncia`;
    return this.http.post(url, formData, { headers })
  }

  postEditConfiguracionDenuncia(formData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}=UpdateTipoDenuncia`;
    return this.http.post(url, formData, { headers })
  }

  postUpdateUser(formData: any): Observable<any> {
    const headers = this.getHeaders();
    let token = localStorage.getItem('token');
    let payload = token?.split('.')[1];
    let decodedPayload = JSON.parse(atob(payload || ''));
    formData.append('ID', decodedPayload.nameid);
    const url = `${this.apiUrlUsuarios}=Update`;
    return this.http.post(url, formData, { headers })
  }

  postDeleteConfiguracionDenuncia(id: number): Observable<any> {
    const headers = this.getHeaders();
    let formData = new FormData();
    formData.append('ID', id.toString());
    const url = `${this.apiUrl}=DeleteTipoDenuncia`;
    return this.http.post(url, formData, { headers })
  }

  postAddReceptor(formData: any): Observable<any> {
    formData.append('IDEMPRESA', config.IDEMPRESA);
    const headers = this.getHeaders();
    const url = `${this.apiUrl}=AddReceptor`;
    return this.http.post(url, formData, { headers })
  }

  postEditReceptor(formData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}=UpdateReceptor`;
    return this.http.post(url, formData, { headers })
  }

  postAddParametro(formData: any): Observable<any> {
    formData.append('IDEMPRESA', config.IDEMPRESA);
    const headers = this.getHeaders();
    const url = `${this.apiUrl}=AddParametro`;
    return this.http.post(url, formData, { headers })
  }

  postEditParametro(formData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}=UpdateParametro`;
    return this.http.post(url, formData, { headers })
  }

  postDeleteParametro(id: number): Observable<any> {
    const headers = this.getHeaders();
    let formData = new FormData();
    formData.append('ID', id.toString());
    const url = `${this.apiUrl}=DeleteParametro`;
    return this.http.post(url, formData, { headers })
  }

  postMovimientoDenuncia(formData: any): Observable<any> {
    formData.append('IDEMPRESA', config.IDEMPRESA);
    const headers = this.getHeaders();
    const url = `${this.apiUrlDenuncias}/PostAddMovimiento`;
    return this.http.post(url, formData, { headers })
  }

  postAddTestigo(formData: any): Observable<any> {
    formData.append('IDEMPRESA', config.IDEMPRESA);
    const headers = this.getHeaders();
    const url = `${this.apiUrlDenuncias}/PostAddTestigo`;
    return this.http.post(url, formData, { headers })
  }

  postDeleteTestigo(id: number): Observable<any> {
    const headers = this.getHeaders();
    let formData = new FormData();
    formData.append('ID', id.toString());
    const url = `${this.apiUrlDenuncias}/PostDeleteTestigo`;
    return this.http.post(url, formData, { headers })
  }

  postAddDocumento(formData: any): Observable<any> {
    formData.append('IDEMPRESA', config.IDEMPRESA);
    const headers = this.getHeaders();
    const url = `${this.apiUrlDenuncias}/PostAddDocumento`;
    return this.http.post(url, formData, { headers })
  }

  postDeleteDocumento(id: number): Observable<any> {
    const headers = this.getHeaders();
    let formData = new FormData();
    formData.append('ID', id.toString());
    const url = `${this.apiUrlDenuncias}/PostDeleteDocumento`;
    return this.http.post(url, formData, { headers })
  }

  postAddAcciones(formData: any): Observable<any> {
    formData.append('IDEMPRESA', config.IDEMPRESA);
    const headers = this.getHeaders();
    const url = `${this.apiUrlDenuncias}/PostAddAcciones`;
    return this.http.post(url, formData, { headers })
  }

  postUpdateAcciones(formData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrlDenuncias}/PostUpdateAcciones`;
    return this.http.post(url, formData, { headers })
  }

  postDeleteAcciones(id: number): Observable<any> {
    const headers = this.getHeaders();
    let formData = new FormData();
    formData.append('ID', id.toString());
    const url = `${this.apiUrlDenuncias}/PostDeleteAcciones`;
    return this.http.post(url, formData, { headers })
  }

  postAddSolicitud(formData: any): Observable<any> {
    formData.append('IDEMPRESA', config.IDEMPRESA);
    const headers = this.getHeaders();
    const url = `${this.apiUrl}=AddSolicitud`;
    return this.http.post(url, formData, { headers })
  }

  postUpdateSolicitud(formData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}=UpdateSolicitud`;
    return this.http.post(url, formData, { headers })
  }

  postDeleteSolicitud(id: number): Observable<any> {
    const headers = this.getHeaders();
    let formData = new FormData();
    formData.append('ID', id.toString());
    const url = `${this.apiUrl}=DeleteSolicitud`;
    return this.http.post(url, formData, { headers })
  }
}