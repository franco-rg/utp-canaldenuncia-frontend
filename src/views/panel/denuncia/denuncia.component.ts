import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DenunciaModel } from 'src/resources/models/Denuncia.model';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-denuncia',
  templateUrl: './denuncia.component.html',
  styleUrls: ['./denuncia.component.css'],
})
export class DenunciaComponent {
  denuncia: DenunciaModel = {} as DenunciaModel;
  loading: boolean = false;
  newMessage: string = '';
  currentUser = true;
  tipoDenuncias: any[] = [];
  receptores: any[] = [];
  parametros: any[] = [];

  // ROLES
  roles: any = {
    'Receptor': 37,
    'Investigador': 39,
    'Decisor': 40,
    'Gestor Denuncia': 38,
  }

  // datos botones
  GDDENUNCIA = null;

  // * MODALES
  showModalModificarTipoDenuncia: boolean = false;
  showModalAsignarInvestigador: boolean = false;
  showModalAgregarTestigo: boolean = false;
  showModalAgregarDocumento: boolean = false;
  showModalAsignarDecisor: boolean = false;
  showModalAgregarAccion: boolean = false;
  showModalArchivarDenuncia: boolean = false;

  constructor(
    private notyf: NotyfService,
    private route: ActivatedRoute,
    private canalAdminService: CanalAdminService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || isNaN(Number(id))) {
      this.notyf.error('El identificador de la denuncia no es válido');
      window.history.back();
      return;
    }

    this.getTipoDenuncias();
    this.getDenuncia(Number(id));
    this.getReceptores();
    this.getParametros();
  }

  getTipoDenuncias() {
    this.canalAdminService.getDenuncia(0, 1000, { search: '', estado: '' })
      .subscribe(
        (response) => {
          this.tipoDenuncias = response;
        },
        (error) => {
          this.notyf.error('Error al cargar los tipos de denuncia');
        }
      );
  }

  getDenuncia(id: number) {
    this.loading = true;
    this.canalAdminService.getFindDenuncias(0, 1, id).subscribe(
      (response) => {
        console.log(response);
        response['jsoN_ACCIONES'] = JSON.parse(response['jsoN_ACCIONES']);
        response['jsoN_USUARIOS'] = JSON.parse(response['jsoN_USUARIOS']);
        response['permisos'] = JSON.parse(response['permisos']);
        this.denuncia = response;
        this.denuncia.totalAcciones = this.denuncia.jsoN_ACCIONES.filter((item: any) => !item.RESUELTO).length;
      },
      (error) => {
        this.notyf.error('Error al cargar la denuncia');
      },
      () => {
        this.loading = false;
      }
    );
  }

  isDenunciaOk(estado: string): boolean {
    let estate = this.denuncia.gddenuncia == estado &&
    this.denuncia.permisos.find((item: any) => item.GDDENUNCIA == estado);

    if(estado == '8'){
      estate = this.denuncia.gddenuncia == estado &&
      this.denuncia.permisos.find((item: any) => item.GDDENUNCIA == '3');
    }

    if(estado == '5'){
      estate = this.denuncia.gddenuncia == estado &&
      this.denuncia.permisos.find((item: any) => item.GDDENUNCIA == '2');
    }

    return estate;
  }

  getGrupoDato(gdfilter: string, valor: string): any {
    let arrayData: any[] = this.canalAdminService.getGrupoDatosByID(gdfilter);
    let findData = arrayData.find((item) => item.vlR1 == valor);
    return findData?.vlR2 || 0;
  }

  getReceptores() {
    this.canalAdminService.getReceptores(0, 1000, { search: "", estado: "A" }).subscribe(
      (response) => {
        this.receptores = response;
      },
      (error) => {
        this.notyf.error('Error al cargar los receptores');
      }
    );
  }

  getParametros() {
    this.canalAdminService.getParametros(0, 1000, { search: '', estado: '' }).subscribe(
      (response) => {
        this.parametros = response;
      },
      (error) => {
        this.notyf.error('Error al cargar los parámetros');
      }
    );
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
    formData.append('TPO', String(true));

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
        this.notyf.error('Error al enviar el mensaje');
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

  getTipoReceptores(tipoRol: string): any[] {
    return this.receptores.filter((item) => item.idrol == this.roles["Receptor"]);
  }

  // ****** MODALES
  toggleModalModificarTipoDenuncia() {
    this.showModalModificarTipoDenuncia = !this.showModalModificarTipoDenuncia;
  }

  toggleModalAsignarInvestigador() {
    this.showModalAsignarInvestigador = !this.showModalAsignarInvestigador;
  }

  toggleModalAgregarTestigo() {
    this.showModalAgregarTestigo = !this.showModalAgregarTestigo;
  }

  toggleModalAgregarDocumento() {
    this.showModalAgregarDocumento = !this.showModalAgregarDocumento;
  }

  toggleModalAsignarDecisor() {
    this.showModalAsignarDecisor = !this.showModalAsignarDecisor;
  }

  toggleModalAgregarAccion() {
    this.showModalAgregarAccion = !this.showModalAgregarAccion;
  }

  toggleModalArchivarDenuncia() {
    this.showModalArchivarDenuncia = !this.showModalArchivarDenuncia;
  }

  // DESESTIMAR DENUNCIA
  postDesestimarDenuncia() {
    this.notyf.swalInputComentario(
      '¿Está seguro de desestimar la denuncia?',
      'Escribe el motivo de la desestimación...',
      (inputValue: string) => {

        if (!this.denuncia.id) return this.notyf.error('El identificador de la denuncia no es válido');
        let formData = new FormData();
        formData.append('IDTPODENUNCIA', '');
        formData.append('IDDENUNCIA', String(this.denuncia.id));
        formData.append('IDREP', '');
        formData.append('COMENTARIO', inputValue);
        formData.append('ACTUAL', 'true');
        formData.append('GDDENUNCIA', "7");
        formData.append('ACCION', '');
        formData.append('INDIC', '2');

        this.loading = true;
        this.canalAdminService.postMovimientoDenuncia(formData).subscribe(
          (response) => {
            if (response.codEstado > 0 && response.esSatisfactoria) {
              this.notyf.success('Se desestimó correctamente la denuncia');
              this.getDenuncia(this.denuncia.id);
            } else {
              this.notyf.error(response?.mensaje || 'Error al desestimar la denuncia');
            }
          },
          (error) => {
            this.notyf.error('Error al desestimar la denuncia');
          },
          () => {
            this.loading = false;
          }
        );
      }
    );
  }

  // VALIDAR COMUNICACION ESTADO 2
  postValidarComunicacion() {
    this.notyf.swalInputSelect(
      'Validar Comunicación',
      `<div>
        <p class="text-left">Asignación de usuario responsable del sistema de gestión de denuncias</p>
      </div>`,
      this.receptores.filter((item) => item.idrol == this.roles["Gestor Denuncia"]).map((item) => ({ label: item.ncmpto, value: item.id })),
      (inputValue: string) => {
        if (!this.denuncia.id) return this.notyf.error('El identificador de la denuncia no es válido');
        let formData = new FormData();
        formData.append('IDTPODENUNCIA', '');
        formData.append('IDDENUNCIA', String(this.denuncia.id));
        formData.append('IDREP', inputValue);
        formData.append('CORREOREP', this.receptores.find((item) => item.id == inputValue)?.correo);
        formData.append('NOMBREREP', this.receptores.find((item) => item.id == inputValue)?.ncmpto);
        formData.append('COMENTARIO', '');
        formData.append('ACTUAL', 'true');
        formData.append('GDDENUNCIA', "2");
        formData.append('ACCION', '');
        formData.append('INDIC', '3');

        this.loading = true;
        this.canalAdminService.postMovimientoDenuncia(formData).subscribe(
          (response) => {
            if (response.codEstado > 0 && response.esSatisfactoria) {
              this.notyf.success('Se validó correctamente la comunicación');
              this.getDenuncia(this.denuncia.id);
            } else {
              this.notyf.error(response?.mensaje || 'Error al validar la comunicación');
            }
          },
          (error) => {
            this.notyf.error('Error al validar la comunicación');
          },
          () => {
            this.loading = false;
          }
        );
      }
    );
  }

  // ESTADO DE DECISOR
  postDecisor() {
    this.notyf.swalInputComentario(
      'Redactar informe final investigación',
      'Escriba las conclusiones finales de la decisión...',
      (inputValue: string) => {
        if (!this.denuncia.id) return this.notyf.error('El identificador de la denuncia no es válido');
        let formData = new FormData();
        formData.append('IDTPODENUNCIA', '');
        formData.append('IDDENUNCIA', String(this.denuncia.id));
        formData.append('IDREP', '');
        formData.append('COMENTARIO', inputValue);
        formData.append('ACTUAL', 'true');
        formData.append('GDDENUNCIA', "8");
        formData.append('ACCION', '');
        formData.append('INDIC', '6');

        this.loading = true;
        this.canalAdminService.postMovimientoDenuncia(formData).subscribe(
          (response) => {
            if (response.codEstado > 0 && response.esSatisfactoria) {
              this.notyf.success('Se envió correctamente al decisor');
              this.getDenuncia(this.denuncia.id);
            } else {
              this.notyf.error(response?.mensaje || 'Error al enviar al decisor');
            }
          },
          (error) => {
            this.notyf.error('Error al enviar al decisor');
          },
          () => {
            this.loading = false;
          }
        );
      }
    );
  }

  postCompliance() {
    this.notyf.swalInputComentario(
      'Redactar informe final decisor',
      'Escriba las conclusiones finales de la decisión...',
      (inputValue: string) => {
        if (!this.denuncia.id) return this.notyf.error('El identificador de la denuncia no es válido');
        let formData = new FormData();
        formData.append('IDTPODENUNCIA', '');
        formData.append('IDDENUNCIA', String(this.denuncia.id));
        formData.append('IDREP', '');
        formData.append('COMENTARIO', inputValue);
        formData.append('ACTUAL', 'true');
        formData.append('GDDENUNCIA', "5");
        formData.append('ACCION', '');
        formData.append('INDIC', '8');

        this.loading = true;
        this.canalAdminService.postMovimientoDenuncia(formData).subscribe(
          (response) => {
            if (response.codEstado > 0 && response.esSatisfactoria) {
              this.notyf.success('Se envió correctamente al compliance');
              this.getDenuncia(this.denuncia.id);
            } else {
              this.notyf.error(response?.mensaje || 'Error al enviar al compliance');
            }
          },
          (error) => {
            this.notyf.error('Error al enviar al compliance');
          },
          () => {
            this.loading = false;
          }
        );
      }
    );
  }

  postRegresarFaseAnterior(fase: string) {
    this.notyf.swalInputComentario(
      '¿Está seguro de regresar a la fase anterior?',
      'Escribe el motivo del regreso...',
      (inputValue: string) => {
        if (!this.denuncia.id) return this.notyf.error('El identificador de la denuncia no es válido');
        let formData = new FormData();
        formData.append('IDTPODENUNCIA', '');
        formData.append('IDDENUNCIA', String(this.denuncia.id));
        formData.append('IDREP', '');
        formData.append('COMENTARIO', inputValue);
        formData.append('ACTUAL', 'true');
        formData.append('GDDENUNCIA', fase);
        formData.append('ACCION', '');
        formData.append('INDIC', '4');

        this.loading = true;
        this.canalAdminService.postMovimientoDenuncia(formData).subscribe(
          (response) => {
            if (response.codEstado > 0 && response.esSatisfactoria) {
              this.notyf.success('Se regresó correctamente a la fase anterior');
              this.getDenuncia(this.denuncia.id);
            } else {
              this.notyf.error(response?.mensaje || 'Error al regresar a la fase anterior');
            }
          },
          (error) => {
            this.notyf.error('Error al regresar a la fase anterior');
          },
          () => {
            this.loading = false;
          }
        );
      }
    );
  }

  postComentarioDenunciante() {
    this.notyf.swalInputComentario(
      'Redactar informe final para el denunciante',
      'Escriba el informe de resolución para el denunciante...',
      (inputValue: string) => {
        if (!this.denuncia.id) return this.notyf.error('El identificador de la denuncia no es válido');
        let formData = new FormData();
        formData.append('IDTPODENUNCIA', '');
        formData.append('IDDENUNCIA', String(this.denuncia.id));
        formData.append('IDREP', '');
        formData.append('COMENTARIO', inputValue);
        formData.append('ACTUAL', 'false');
        formData.append('GDDENUNCIA', this.denuncia.gddenuncia);
        formData.append('ACCION', '');
        formData.append('INDIC', '9');

        this.loading = true;
        this.canalAdminService.postMovimientoDenuncia(formData).subscribe(
          (response) => {
            if (response.codEstado > 0 && response.esSatisfactoria) {
              this.notyf.success('Se agregó correctamente el comentario para el denunciante');
              this.getDenuncia(this.denuncia.id);
            } else {
              this.notyf.error(response?.mensaje || 'Error al agregar el comentario para el denunciante');
            }
          },
          (error) => {
            this.notyf.error('Error al agregar el comentario para el denunciante');
          },
          () => {
            this.loading = false;
          }
        );
      }
    );
  }

  postCompletarAccion(accion: any) {
    if (!accion.ID) return this.notyf.error('El identificador de la acción no es válido');
    let formData = new FormData();
    formData.append('ID', String(accion.ID));
    formData.append('IDDENUNCIA', String(this.denuncia.id));
    formData.append('NOMBRE', accion.NOMBRE);
    formData.append('CONTACTO', accion.CONTACTO);
    formData.append('EMAIL', accion.EMAIL);
    formData.append('DESCRIPCION', accion.DESCRIPCION);
    formData.append('RESUELTO', String(true));
    formData.append('CESTDO', accion.CESTDO);

    this.loading = true;
    this.canalAdminService.postUpdateAcciones(formData).subscribe(
      (response) => {
        if (response.codEstado > 0 && response.esSatisfactoria) {
          this.notyf.success('Se completó correctamente la acción');
          this.getDenuncia(this.denuncia.id);
        } else {
          this.notyf.error(response?.mensaje || 'Error al completar la acción');
        }
      },
      (error) => {
        this.notyf.error('Error al completar la acción');
      },
    );
  }

  postArchivarDenuncia() {
    if (this.denuncia.totalAcciones > 0) {
      this.notyf.error('No se puede archivar la denuncia porque tiene acciones pendientes');
      return;
    }

    this.toggleModalArchivarDenuncia();
  }
}
