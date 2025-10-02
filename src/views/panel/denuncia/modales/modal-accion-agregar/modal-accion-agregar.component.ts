import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DenunciaModel } from 'src/resources/models/Denuncia.model';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-accion-agregar',
  templateUrl: './modal-accion-agregar.component.html',
  styleUrls: ['./modal-accion-agregar.component.css'],
})
export class ModalAccionAgregarComponent implements OnInit {
  @Input() show = false;
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
      NOMBRE: [null, Validators.required],
      CONTACTO: [null],
      EMAIL: [null],
      DESCRIPCION: [null],
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
    formData.append('IDDENUNCIA', this.denunciaActual.id.toString());
    formData.append('NOMBRE', this.form.value.NOMBRE);
    formData.append('CONTACTO', this.form.value.CONTACTO);
    formData.append('EMAIL', this.form.value.EMAIL);
    formData.append('DESCRIPCION', this.form.value.DESCRIPCION);
    formData.append('RESUELTO', 'false');

    this.loading = true;
    this.canalAdminService.postAddAcciones(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Acción agregada correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error(res?.mensaje || 'Error al agregar la acción');
        }
      },
      error: () => {
        this.notyf.error('Error al agregar la acción');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
