import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import config from 'src/resources/endpoints';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DenunciaService {
    private apiUrl: string = `${config.URL}/canaldenuncias/denuncias/Index?handler`;

    constructor(private http: HttpClient) { }

    onValidateDenuncia(denuncia: any): any {
        const headers = new HttpHeaders({
            'XSRF-TOKEN': config.TOKEN,
        });

        return this.http.post(`${this.apiUrl}=ValidateDenuncia`, denuncia, { headers })
            .pipe(
                map((response: any) => {
                    return response;
                })
            );
    }

    obtenerDenuncia(id: string): any {
        const headers = new HttpHeaders({
            'XSRF-TOKEN': config.TOKEN,
        });

        return this.http.get(`${this.apiUrl}=DenunciasFind&ID=${id}&start=0&length=1&IDEMPRESA=${config.IDEMPRESA}`, { headers })
            .pipe(
                map((response: any) => {
                    return response;
                })
            );
    }

}