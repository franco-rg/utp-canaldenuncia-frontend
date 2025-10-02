import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DenunciaModel } from 'src/resources/models/Denuncia.model';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-asignar-investigador',
  templateUrl: './modal-asignar-investigador.component.html',
  styleUrls: ['./modal-asignar-investigador.component.css'],
})
export class ModalAsignarInvestigadorComponent implements OnInit {
  @Input() show = false;
  @Input() receptores: any[] = [];
  @Input() parametros: any[] = [];
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
      IDREP: [null, Validators.required],
      DSFSINVSTGDR: [null, Validators.required],
      DSFSDCSR: [null, Validators.required],
      DSFSCRRE: [null, Validators.required],
    });
  }

  cerrar() {
    this.form.reset();
    this.initialized = false;
    this.close.emit();
  }


  private initialized = false;

  ngOnChanges() {
    if (this.show && !this.initialized) {
      this.form.patchValue({
        IDREP: null,
        DSFSINVSTGDR: this.parametros.find((x) => x?.abrev == 'DSFSINVSTGDR')?.vlR1 || 0,
        DSFSDCSR: this.parametros.find((x) => x?.abrev == 'DSFSDCSR')?.vlR1 || 0,
        DSFSCRRE: this.parametros.find((x) => x?.abrev == 'DSFSCRRE')?.vlR1 || 0,
      });
      this.initialized = true;
    }
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
    formData.append('GDDENUNCIA', '3');
    formData.append('ACCION', '');
    formData.append('INDIC', '5');
    formData.append('DSFSINVSTGDR', this.form.value.DSFSINVSTGDR);
    formData.append('DSFSDCSR', this.form.value.DSFSDCSR);
    formData.append('DSFSCRRE', this.form.value.DSFSCRRE);

    this.loading = true;
    this.canalAdminService.postMovimientoDenuncia(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Se asigno el investigador correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error(res?.mensaje || 'Error al asignar el investigador');
        }
      },
      error: () => {
        this.notyf.error('Error al asignar el investigador');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
