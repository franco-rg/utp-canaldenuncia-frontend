import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-editar-gestor',
  templateUrl: './modal-editar-gestor.component.html',
  styleUrls: ['./modal-editar-gestor.component.css'],
})
export class ModalEditarGestorComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter();
  @Output() reload = new EventEmitter();
  @Input() roles: any[] = [];
  @Input() usuarios: any[] = [];
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
      IDUSER: [{value: null, disabled: true}, Validators.required],
      IDROL: [null, Validators.required],
      PRINCIPAL: [false],
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
        IDUSER: this.data?.iduser || null,
        IDROL: this.data?.idrol || null,
        PRINCIPAL: this.data?.principal || null,
        CESTDO: this.data?.cestdo || null,
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
    formData.append('IDROL', this.form.value.IDROL);
    formData.append('PRINCIPAL', this.form.value.PRINCIPAL ? 'true' : 'false');
    formData.append('CESTDO', this.form.value.CESTDO);

    this.loading = true;
    this.canalAdminService.postEditReceptor(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Receptor Editado correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error(res?.mensaje || 'Error al editar el Receptor');
        }
      },
      error: (err) => {
        this.notyf.error('Error al editar el Receptor');
      },
      complete: () => {
        this.loading = false;
      },
    });

  }
}
