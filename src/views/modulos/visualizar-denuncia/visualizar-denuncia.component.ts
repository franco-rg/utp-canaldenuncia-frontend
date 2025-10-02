import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';
import { DenunciaService } from 'src/resources/services/modulos/visualizar-denuncia/denuncia.service';

@Component({
  selector: 'app-visualizar-denuncia',
  templateUrl: './visualizar-denuncia.component.html',
  styleUrls: ['./visualizar-denuncia.component.css']
})
export class VisualizarDenunciaComponent implements OnInit {
  breadcrumb = [
    { label: 'Módulos', url: '/modulos' },
    { label: 'Ver denuncias', url: '/ver-denuncias' }
  ];
  newMessage: string = '';
  currentUser = false;
  formLogin: FormGroup;
  isDenunciaOk: boolean = false;
  denuncia: any = false;
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private denunciaService: DenunciaService,
    private notyf: NotyfService,
    private canalAdminService: CanalAdminService
  ) {
    this.formLogin = new FormGroup({
      CODIGO: new FormControl('', [Validators.required]),
      CONTRASENA: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
  }

  onValidateDenuncia() {
    if (!this.isValid) {
      this.notyf.error('Por favor, completa todos los campos requeridos.');
      return;
    }

    let formData = new FormData();
    formData.append('CODIGO', this.formLogin.value.CODIGO);
    formData.append('CONTRASENA', this.formLogin.value.CONTRASENA);

    this.loading = true;
    this.denunciaService.onValidateDenuncia(formData).subscribe(
      (response: any) => {
        if (response.success) {
          this.denunciaService.obtenerDenuncia(response.id).subscribe(
            (denunciaResponse: any) => {
              this.loading = false;
              if (denunciaResponse.success) {
                console.log(denunciaResponse.data);
                this.isDenunciaOk = true;
                denunciaResponse.data['jsoN_ACCIONES'] = JSON.parse(denunciaResponse.data['jsoN_ACCIONES']);
                denunciaResponse.data['jsoN_USUARIOS'] = JSON.parse(denunciaResponse.data['jsoN_USUARIOS']);
                this.denuncia = denunciaResponse.data;
                this.denuncia.totalAcciones = this.denuncia.jsoN_ACCIONES.filter((item: any) => !item.RESUELTO).length;
                this.notyf.success('Mostrando denuncia con éxito');
              } else {
                this.notyf.error(denunciaResponse.message || 'Error al obtener la denuncia: ' + denunciaResponse.message);
              }
            }
          );
        } else {
          this.loading = false;
          this.notyf.error(response?.message || 'Error al validar la denuncia');
        }
      },
      (error: any) => {
        this.loading = false;
        this.notyf.error('Error en la conexión con el servidor: ' + error.message);
      }
    );
  }


  getGrupoDato(gdfilter: string, valor: string): any {
    let arrayData: any[] = this.canalAdminService.getGrupoDatosByID(gdfilter);
    let findData = arrayData.find((item) => item.vlR1 == valor);
    return findData?.vlR2 || 0;
  }

  logout() {
    this.denuncia = {} as any;
    this.isDenunciaOk = false;
    this.formLogin.reset();
    this.formLogin.get('CODIGO')?.setValue('DENUNCIA_36');
    this.formLogin.get('CONTRASENA')?.setValue('12345cC.');
  }

  sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }

    if (!this.denuncia.id) {
      this.notyf.error('El Identificador de la denuncia no es válido');
      return;
    }

    let formData = new FormData();

    formData.append('IDDENUNCIA', String(this.denuncia.id));
    formData.append('IDRECEPTOR', '');
    formData.append('MENSAJE', this.newMessage);
    formData.append('TPO', String(false));

    this.loading = true;
    this.canalAdminService.postChatDenuncia(formData).subscribe(
      (response) => {
        if (!response?.esSatisfactoria) return this.notyf.error(response?.mensaje || 'Error al enviar el mensaje');
        this.denuncia.chat.push({
          usuario: "YO",
          mensaje: this.newMessage,
          tpo: true,
          fcrcn: new Date().toISOString(),
          id: response.codEstado,
          idreceptor: response.retorno
        });

        this.newMessage = '';
      },
      (error) => {
        this.notyf.error('Error al enviar el mensaje: ' + error.message);
      },
      () => {
        this.loading = false;
      }
    );
  }

  getValidador(valor: string): boolean {
    // 1 -> acciones, 2 -> historial usuarios, 3 -> archivo adjuntos
    // 4 -> testigos, 5 -> medida cautelar, 6 -> cambio gestor denuncia
    // 7 -> informe investigador, 8 -> inform decisor
    // 9 -> informe compliance, 10 -> informe denunciante, 11 -> chat
    const estados: Record<string, string[]> = {
      '1': ["2", "3", "4", "5", "11"],
      '2': ["2", "3", "4", "5", "11"],
      '3': ["2", "3", "4", "5", "7", "11"],
      '8': ["2", "3", "4", "5", "7", "11"],
      '4': ["2", "3", "4", "5", "7", "8", "11"],
      '5': ["1", "2", "3", "4", "5", "7", "8", "9", "10", "11"],
      '6': ["1", "2", "3", "4", "5", "7", "8", "9", "10", "11"],
      '7': ["2", "3", "4", "5", "11"],
    };

    const permitidos = estados[this.denuncia?.gddenuncia];

    if (!permitidos) {
      return false;
    }

    return permitidos.includes(valor);
  }

  get isValid(): boolean {
    return this.formLogin.valid;
  }
}
