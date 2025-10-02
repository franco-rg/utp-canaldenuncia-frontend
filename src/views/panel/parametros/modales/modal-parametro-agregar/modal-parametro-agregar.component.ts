import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-parametro-agregar',
  templateUrl: './modal-parametro-agregar.component.html',
  styleUrls: ['./modal-parametro-agregar.component.css'],
})
export class ModalParametroAgregarComponent implements OnInit {
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
      ABREV: ['', Validators.required],
      VLR1: ['', Validators.required],
      VLR2: [''],
      VLR3: [''],
    });
  }

  cerrar() {
    this.form.reset();
    this.close.emit();
  }

  enviar() {
    if (!this.form.valid) return this.form.markAllAsTouched();
    let formData = new FormData();
    formData.append('DESCP', this.form.get('DESCP')?.value);
    formData.append('ABREV', this.form.get('ABREV')?.value);
    formData.append('VLR1', this.form.get('VLR1')?.value);
    formData.append('VLR2', this.form.get('VLR2')?.value);
    formData.append('VLR3', this.form.get('VLR3')?.value);
    formData.append('CESTDO', 'A');
    
    this.loading = true;
    this.canalAdminService.postAddParametro(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Parametro agregado correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error('Error al agregar el Parametro');
        }
      },
      error: () => {
        this.notyf.error('Error al agregar el Parametro');
      },
      complete: () => {
        this.loading = false;
      },
    });

  }
}
