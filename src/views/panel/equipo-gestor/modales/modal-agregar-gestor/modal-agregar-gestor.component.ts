import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-agregar-gestor',
  templateUrl: './modal-agregar-gestor.component.html',
  styleUrls: ['./modal-agregar-gestor.component.css'],
})
export class ModalAgregarGestorComponent implements OnInit {
  @Input() show = false;
  @Input() roles: any[] = [];
  @Input() usuarios: any[] = [];
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
      IDUSER: [null, Validators.required],
      IDROL: [null, Validators.required],
      PRINCIPAL: [false]
    });
  }

  cerrar() {
    this.form.reset();
    this.close.emit();
  }

  enviar() {
    if (!this.form.valid) return this.form.markAllAsTouched();

    let formData = new FormData();
    formData.append('IDROL', this.form.value.IDROL);
    formData.append('IDUSER', this.form.value.IDUSER);
    formData.append('PRINCIPAL', this.form.value.PRINCIPAL ? 'true' : 'false');
    formData.append('CESTDO', 'A');

    this.loading = true;
    this.canalAdminService.postAddReceptor(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Receptor agregado correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error(res?.mensaje || 'Error al agregar el receptor');
        }
      },
      error: () => {
        this.notyf.error('Error al agregar el receptor');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
