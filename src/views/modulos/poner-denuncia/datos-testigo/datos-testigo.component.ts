import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormularioDenunciaService } from 'src/resources/services/modulos/poner-denuncia/formulario-denuncia.service';

@Component({
  selector: 'app-datos-testigo',
  templateUrl: './datos-testigo.component.html',
  styleUrls: ['./datos-testigo.component.css']
})
export class DatosTestigoComponent implements OnInit {
  formDatosTestigo: FormGroup;
  testigos: any[] = [];

  constructor(
    private formularioDenunciaService: FormularioDenunciaService,
    private route: ActivatedRoute
  ) {
    this.formDatosTestigo = new FormGroup({
      NombreTestigo: new FormControl(''),
      ApellidosTestigo: new FormControl(''),
      CorreoTestigo: new FormControl('', Validators.email),
      TelefonoTestigo: new FormControl('', Validators.pattern(/^\d{9}$/)),
      ComentariosTestigo: new FormControl('', Validators.maxLength(4000))
    },
    { validators: this.alMenosUnCampoLleno });
  }

  ngOnInit() {
    const currentPath = this.route.snapshot.routeConfig?.path;
    if (!currentPath) return;
    const savedData = this.formularioDenunciaService.getFormData(currentPath);
    if (savedData) {
      this.testigos = savedData;
    }
  }

  getFormData() {
    return this.testigos;
  }

  setFormData(data: any) {
    if (data) {
      this.testigos = data.testigos;
    }
  }

  alMenosUnCampoLleno(group: AbstractControl): ValidationErrors | null {
    const controls = group.value;
    const tieneDatos = Object.values(controls).some(value => value && value.toString().trim() !== '');
  
    return tieneDatos ? null : { alMenosUnCampo: true };
  }  

  agregarTestigo() {
    if (this.formDatosTestigo.valid) {
      this.testigos.push({
        nombre: this.formDatosTestigo.value.NombreTestigo,
        apellidos: this.formDatosTestigo.value.ApellidosTestigo,
        correo: this.formDatosTestigo.value.CorreoTestigo,
        telefono: this.formDatosTestigo.value.TelefonoTestigo,
        comentarios: this.formDatosTestigo.value.ComentariosTestigo
      });

      this.formDatosTestigo.reset();
    }
  }

  eliminarTestigo(index: number) {
    this.testigos.splice(index, 1);
    this.formDatosTestigo.reset();
  }

  get isValid(): boolean {
    return true;
  }
}
