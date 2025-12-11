import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';
import { DenunciaService } from 'src/resources/services/modulos/visualizar-denuncia/denuncia.service';

@Component({
  selector: 'app-logout-denuncia',
  templateUrl: './logout-denuncia.component.html',
  styleUrls: ['./logout-denuncia.component.css'],
})
export class LogoutDenunciaComponent {
  breadcrumb = [
    { label: 'Módulos', url: '/modulos' },
    { label: 'Ver denuncias', url: '/ver-denuncias' }
  ];

  formLogin: FormGroup;
  denuncia: any = false;
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private denunciaService: DenunciaService,
    private notyf: NotyfService,
    private router: Router
  ) {
    this.formLogin = new FormGroup({
      CODIGO: new FormControl('', [Validators.required]),
      CONTRASENA: new FormControl('', [Validators.required]),
    });
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
          let base64Number = btoa(response.id.toString()) + '_' + btoa(response.CODIGO);
          this.router.navigate(['modulos/ver-denuncias/' + base64Number]);
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

  get isValid(): boolean {
    return this.formLogin.valid;
  }
}


