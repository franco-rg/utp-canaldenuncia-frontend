import { Component, EventEmitter, Output, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DenunciaModel } from 'src/resources/models/Denuncia.model';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-archivar-denuncia-agregar',
  templateUrl: './modal-archivar-denuncia-agregar.component.html',
  styleUrls: ['./modal-archivar-denuncia-agregar.component.css'],
})
export class ModalArchivarDenunciaAgregarComponent  implements OnInit {
  @Input() show = false;
  @Input() denunciaActual: DenunciaModel = {} as DenunciaModel;
  @Output() close = new EventEmitter();
  @Output() reload = new EventEmitter();
  archivoCargado = false;
  form!: FormGroup;
  loading: boolean = false;
  @ViewChild('fileInputArc') fileInputArc!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private canalAdminService: CanalAdminService,
    private notyf: NotyfService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      Archivo: [null, Validators.required],
      COMENTARIOS: [null, Validators.maxLength(4000)],
    });
  }

  cerrar() {
    this.archivoCargado = false;
    this.fileInputArc.nativeElement.value = '';
    this.form.reset();
    this.close.emit();
  }

  seleccionarArchivo() {
    this.fileInputArc.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoCargado = true;
      this.form.patchValue({ Archivo: file });
      this.cdr.detectChanges();
    }
  }

  enviar() {
    if (!this.form.valid) return this.form.markAllAsTouched();
    if (!this.denunciaActual.id) return this.notyf.error('No se encontro el identificador de la denuncia');

    let formData = new FormData();
    formData.append('FILES', this.form.value.Archivo);
    formData.append('IDTPODENUNCIA', '');
    formData.append('IDDENUNCIA', String(this.denunciaActual.id));
    formData.append('IDREP', '');
    formData.append('COMENTARIO', this.form.value.COMENTARIOS || '');
    formData.append('ACTUAL', 'true');
    formData.append('GDDENUNCIA', "6");
    formData.append('ACCION', '');
    formData.append('INDIC', '10');

    this.loading = true;
    this.canalAdminService.postMovimientoDenuncia(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Se ha archivado la denuncia correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error(res?.mensaje || 'Error al archivar la denuncia');
        }
      },
      error: () => {
        this.notyf.error('Error al archivar la denuncia');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
