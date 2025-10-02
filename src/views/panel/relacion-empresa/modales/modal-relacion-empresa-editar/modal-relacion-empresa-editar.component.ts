import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-relacion-empresa-editar',
  templateUrl: './modal-relacion-empresa-editar.component.html',
  styleUrls: ['./modal-relacion-empresa-editar.component.css'],
})
export class ModalRelacionEmpresaEditarComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter();
  @Output() reload = new EventEmitter();
  @Input() data: any;

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
      CESTDO: [''],
    });
  }

  cerrar() {
    this.form.reset();
    this.close.emit();
  }

  ngOnChanges() {
    if (this.show) {
      this.form.patchValue({
        DESCP: this.data.descp,
        DETALLE: this.data?.detalle || '',
        CESTDO: this.data.cestdo,
      });
    }else {
      this.form.reset();
    }
  }

  enviar() {
    if (!this.form.valid) return this.form.markAllAsTouched();
    if (!this.data.id) return this.notyf.error('No se encontró el identificador');

    let formData = new FormData();
    formData.append('ID', this.data.id);
    formData.append('DESCP', this.form.get('DESCP')?.value);
    formData.append('DETALLE', this.form.get('DETALLE')?.value);
    formData.append('CESTDO', this.form.get('CESTDO')?.value);
    this.loading = true;
    this.canalAdminService.postEditConfiguracionDenuncia(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Relación Empresa Editado correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error('Error al editar la Relación Empresa');
        }
      },
      error: (err) => {
        this.notyf.error('Error al editar la Relación Empresa');
      },
      complete: () => {
        this.loading = false;
      },
    });

  }
}
