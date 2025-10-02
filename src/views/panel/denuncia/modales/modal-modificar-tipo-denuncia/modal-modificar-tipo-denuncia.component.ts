import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DenunciaModel } from 'src/resources/models/Denuncia.model';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-modificar-tipo-denuncia',
  templateUrl: './modal-modificar-tipo-denuncia.component.html',
  styleUrls: ['./modal-modificar-tipo-denuncia.component.css'],
})
export class ModalModificarTipoDenunciaComponent implements OnInit {
  @Input() show = false;
  @Input() roles: any[] = [];
  @Input() denuncias: any[] = [];
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
      IDTPODENUNCIA: [null, Validators.required]
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
    formData.append('IDTPODENUNCIA', this.form.value.IDTPODENUNCIA);
    formData.append('DIDTPODENUNCIA', this.denuncias.find((x) => x.id == this.form.value.IDTPODENUNCIA)?.descp);
    formData.append('IDDENUNCIA', this.denunciaActual.id.toString());
    formData.append('IDREP', '');
    formData.append('COMENTARIO', '');
    formData.append('ACTUAL', 'false');
    formData.append('GDDENUNCIA', this.denunciaActual.gddenuncia);
    formData.append('ACCION', '');
    formData.append('INDIC', '1');

    this.loading = true;
    this.canalAdminService.postMovimientoDenuncia(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Se Modifico correctamente el tipo de denuncia');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error(res?.mensaje || 'Error al modificar el tipo de denuncia');
        }
      },
      error: () => {
        this.notyf.error('Error al modificar el tipo de denuncia');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
