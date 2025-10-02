import { Component, EventEmitter, Output, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DenunciaModel } from 'src/resources/models/Denuncia.model';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-modal-documento-agregar',
  templateUrl: './modal-documento-agregar.component.html',
  styleUrls: ['./modal-documento-agregar.component.css'],
})
export class ModalDocumentoAgregarComponent implements OnInit {
  @Input() show = false;
  @Input() denunciaActual: DenunciaModel = {} as DenunciaModel;
  @Output() close = new EventEmitter();
  @Output() reload = new EventEmitter();
  archivoCargado = false;
  form!: FormGroup;
  loading: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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
    this.fileInput.nativeElement.value = '';
    this.form.reset();
    this.close.emit();
  }

  seleccionarArchivo() {
    this.fileInput.nativeElement.click();
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
    formData.append('IDDENUNCIA', this.denunciaActual.id.toString());
    formData.append('NARCHIVO', '');
    formData.append('COMENTARIOS', this.form.value.COMENTARIOS || '');


    this.loading = true;
    this.canalAdminService.postAddDocumento(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Se ha cargado el documento correctamente');
          this.reload.emit(null);
          this.cerrar();
        } else {
          this.notyf.error(res?.mensaje || 'Error al cargar el documento');
        }
      },
      error: () => {
        this.notyf.error('Error al cargar el documento');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
