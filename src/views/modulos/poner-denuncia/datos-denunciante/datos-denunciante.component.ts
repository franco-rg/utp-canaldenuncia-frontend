import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RelacionEmpresaModel } from 'src/resources/models/RelacionEmpresa.model';
import { FormularioDenunciaService } from 'src/resources/services/modulos/poner-denuncia/formulario-denuncia.service';
import { ValidatorsService } from 'src/resources/services/validators.service';

@Component({
  selector: 'app-datos-denunciante',
  templateUrl: './datos-denunciante.component.html',
  styleUrls: ['./datos-denunciante.component.css']
})
export class DatosDenuncianteComponent implements OnInit {
  formDatosDenunciante: FormGroup;
  relaciones: RelacionEmpresaModel[] = [];

  constructor(
    private formularioDenunciaService: FormularioDenunciaService,
    private route: ActivatedRoute,
    private validatorsService: ValidatorsService
  ) {
    this.formDatosDenunciante = new FormGroup({
      RelacionEmpresaId: new FormControl('', Validators.required),
      NombresDenunciante: new FormControl(''),
      ApellidosDenunciante: new FormControl(''),
      CorreoDenunciante: new FormControl('', [this.conditionalValidator(() => this.formDatosDenunciante?.get('CorreoDenunciante')?.value !== '', this.validatorsService.emailFormatValidator)]),
      TelefonoDenunciante: new FormControl('', [this.conditionalValidator(() => this.formDatosDenunciante?.get('TelefonoDenunciante')?.value !== '', Validators.pattern(/^\d{9}$/))])
    });
  }

  ngOnInit() {
    const currentPath = this.route.snapshot.routeConfig?.path;
    if (!currentPath) return;
    const savedData = this.formularioDenunciaService.getFormData(currentPath);
    if (savedData) {
      this.formDatosDenunciante.patchValue(savedData);
    }

    this.relaciones = this.formularioDenunciaService.getRelacionEmpresaUrl();
  }

  conditionalValidator(condition: () => boolean, validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!condition()) return null;
      return validator(control);
    };
  }

  getFormData() {
    return this.formDatosDenunciante.value;
  }

  setFormData(data: any) {
    if (data) {
      this.formDatosDenunciante.patchValue(data);
    }
  }

  get isValid(): boolean {
    return this.formDatosDenunciante.valid;
  }
}
