import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-rol-gestor-agregar',
  templateUrl: './modal-rol-gestor-agregar.component.html',
  styleUrls: ['./modal-rol-gestor-agregar.component.css'],
})
export class ModalRolGestorAgregarComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter();
  @Output() reload = new EventEmitter();

  form!: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private canalAdminService: CanalAdminService,
    private notyf: NotyfService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      DESCP: ['', Validators.required],
      DETALLE: [''],
    });
  }

  cerrar() {
    this.form.reset();
    this.close.emit();
  }

  enviar() {
    if (!this.form.valid) return this.form.markAllAsTouched();
    let formData = new FormData();
    formData.append('TIPO', '3');
    formData.append('DESCP', this.form.get('DESCP')?.value);
    formData.append('DETALLE', this.form.get('DETALLE')?.value);
    formData.append('CESTDO', 'A');
    this.loading = true;
    this.canalAdminService.postAddConfiguracionDenuncia(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Rol agregado correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error('Error al agregar el rol');
        }
      },
      error: () => {
        this.notyf.error('Error al agregar el rol');
      },
      complete: () => {
        this.loading = false;
      },
    });

  }
}
