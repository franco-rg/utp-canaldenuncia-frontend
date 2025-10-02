import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DenunciaModel } from 'src/resources/models/Denuncia.model';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-testigo-agregar',
  templateUrl: './modal-testigo-agregar.component.html',
  styleUrls: ['./modal-testigo-agregar.component.css'],
})
export class ModalTestigoAgregarComponent implements OnInit {
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
      APELLIDO: [null],
      CORREO: [null],
      TELEFONO: [null],
      COMENTARIOS: [null],
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
    formData.append('APELLIDO', this.form.value.APELLIDO);
    formData.append('CORREO', this.form.value.CORREO);
    formData.append('TELEFONO', this.form.value.TELEFONO);
    formData.append('COMENTARIOS', this.form.value.COMENTARIOS);

    this.loading = true;
    this.canalAdminService.postAddTestigo(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Testigo agregado correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error(res?.mensaje || 'Error al agregar testigo');
        }
      },
      error: () => {
        this.notyf.error('Error al agregar testigo');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
