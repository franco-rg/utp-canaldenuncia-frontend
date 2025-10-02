import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DenunciaModel } from 'src/resources/models/Denuncia.model';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-asignar-decisor',
  templateUrl: './modal-asignar-decisor.component.html',
  styleUrls: ['./modal-asignar-decisor.component.css'],
})
export class ModalAsignarDecisorComponent implements OnInit {
  @Input() show = false;
  @Input() receptores: any[] = [];
  @Input() denunciaActual: DenunciaModel = {} as DenunciaModel;
  @Output() close = new EventEmitter();
  @Output() reload = new EventEmitter();

  form!: FormGroup;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private canalAdminService: CanalAdminService,
    private notyf: NotyfService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      IDREP: [null, Validators.required]
    });
  }

  cerrar() {
    this.form.reset();
    this.close.emit();
  }


  enviar() {
    if (!this.form.valid) return this.form.markAllAsTouched();
    if (!this.denunciaActual.id) return this.notyf.error('No se encontro el identificador de la denuncia');

    let formData = new FormData();
    formData.append('IDTPODENUNCIA', '');
    formData.append('IDDENUNCIA', this.denunciaActual.id.toString());
    formData.append('IDREP', this.form.value.IDREP);
    formData.append('CORREOREP', this.receptores.find((item) => item.id ==  this.form.value.IDREP)?.correo);
    formData.append('NOMBREREP', this.receptores.find((item) => item.id ==  this.form.value.IDREP)?.ncmpto);
    formData.append('COMENTARIO', '');
    formData.append('ACTUAL', 'true');
    formData.append('GDDENUNCIA', '4');
    formData.append('ACCION', '');
    formData.append('INDIC', '7');
    formData.append('DSFSINVSTGDR', '');
    formData.append('DSFSDCSR', '');
    formData.append('DSFSCRRE', '');

    this.loading = true;
    this.canalAdminService.postMovimientoDenuncia(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Se asigno el decisor correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error(res?.mensaje || 'Error al asignar el decisor');
        }
      },
      error: () => {
        this.notyf.error('Error al asignar el decisor');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
