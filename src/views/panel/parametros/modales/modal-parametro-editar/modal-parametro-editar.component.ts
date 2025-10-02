import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-parametro-editar',
  templateUrl: './modal-parametro-editar.component.html',
  styleUrls: ['./modal-parametro-editar.component.css'],
})
export class ModalParametroEditarComponent  implements OnInit {
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
      ABREV: ['', Validators.required],
      VLR1: ['', Validators.required],
      VLR2: [''],
      VLR3: [''],
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
        ABREV: this.data.abrev,
        VLR1: this.data.vlR1,
        VLR2: this.data.vlR2,
        VLR3: this.data.vlR3,
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
    formData.append('ABREV', this.form.get('ABREV')?.value);
    formData.append('VLR1', this.form.get('VLR1')?.value);
    formData.append('VLR2', this.form.get('VLR2')?.value);
    formData.append('VLR3', this.form.get('VLR3')?.value);
    formData.append('CESTDO', this.form.get('CESTDO')?.value);

    this.loading = true;
    this.canalAdminService.postEditParametro(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Parametro Editado correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error('Error al editar el Parametro');
        }
      },
      error: (err) => {
        this.notyf.error('Error al editar el Parametro');
      },
      complete: () => {
        this.loading = false;
      },
    });

  }
}
