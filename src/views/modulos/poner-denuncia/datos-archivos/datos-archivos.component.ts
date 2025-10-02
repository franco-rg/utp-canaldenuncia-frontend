import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormularioDenunciaService } from 'src/resources/services/modulos/poner-denuncia/formulario-denuncia.service';

@Component({
  selector: 'app-datos-archivos',
  templateUrl: './datos-archivos.component.html',
  styleUrls: ['./datos-archivos.component.css']
})
export class DatosArchivosComponent implements OnInit {
  formDatosArchivos: FormGroup;
  archivos: any[] = [];
  archivoCargado = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private formularioDenunciaService: FormularioDenunciaService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.formDatosArchivos = new FormGroup({
      Archivo: new FormControl('', Validators.required),
      ComentarioArchivos: new FormControl('', Validators.maxLength(4000))
    });
  }

  ngOnInit() {
    const currentPath = this.route.snapshot.routeConfig?.path;
    if (!currentPath) return;
    const savedData = this.formularioDenunciaService.getFormData(currentPath);
    if (savedData) {
      this.archivos = savedData;
    }
  }

  getFormData() {
    return this.archivos;
  }

  setFormData(data: any) {
    if (data) {
      this.archivos = data.archivos;
    }
  }

  seleccionarArchivo() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoCargado = true;
      this.formDatosArchivos.patchValue({ Archivo: file });
      this.cdr.detectChanges();
    }
  }

  agregarArchivo() {
    const file = this.formDatosArchivos.value.Archivo;
    const comentario = this.formDatosArchivos.value.ComentarioArchivos;

    if (!file) {
      alert('Por favor, selecciona un archivo antes de cargar.');
      return;
    }

    const nuevoArchivo = {
      nombreArchivo: file?.name,
      tamano: this.formatFileSize(file?.size),
      size: file?.size,
      comentarios: comentario || '',
      file: file,
    };

    this.archivos.push(nuevoArchivo);
    this.archivoCargado = false;

    this.formDatosArchivos.reset();
    this.fileInput.nativeElement.value = '';
    this.cdr.detectChanges();
  }

  eliminarArchivo(index: number) {
    this.archivos.splice(index, 1);
  }

  private formatFileSize(size: number | null): string | null {
    if (!size) return '---';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  get isValid(): boolean {
    return true;
  }
}