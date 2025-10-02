import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormularioDenunciaService } from 'src/resources/services/modulos/poner-denuncia/formulario-denuncia.service';
import { ValidatorsService } from 'src/resources/services/validators.service';

@Component({
  selector: 'app-asignar-contrasena',
  templateUrl: './asignar-contrasena.component.html',
  styleUrls: ['./asignar-contrasena.component.css']
})
export class AsignarContrasenaComponent implements OnInit {
  formAsignarContrasena: FormGroup;
  showPassword = false;
  showRepeatPassword = false;
  correoDenunciante: boolean = false;

  constructor(
    private formularioDenunciaService: FormularioDenunciaService,
    private route: ActivatedRoute,
    private validatorsService: ValidatorsService
  ) {
    this.formAsignarContrasena = new FormGroup({
      Contrasena: new FormControl('', [Validators.required, this.passwordValidator]),
      RepetirContrasena: new FormControl('', [Validators.required]),
      Correo: new FormControl('')
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    const currentPath = this.route.snapshot.routeConfig?.path;
    if (!currentPath) return;

    const savedData = this.formularioDenunciaService.getFormData(currentPath);
    if (savedData) {
      this.formAsignarContrasena.patchValue(savedData);
    } else {
      this.formAsignarContrasena.valueChanges.subscribe((data) => {
        if (this.formAsignarContrasena.valid) {
          this.setFormData(data);
        }
      });
    }

    const datosDenunciante = this.formularioDenunciaService.getFormData('datos-denunciante');
    this.correoDenunciante = Boolean(datosDenunciante?.CorreoDenunciante);

    // if (!this.correoDenunciante) {
    //   this.formAsignarContrasena.get('Correo')?.setValidators([Validators.required, Validators.email, this.validatorsService.emailFormatValidator]);
    //   this.formAsignarContrasena.get('Correo')?.updateValueAndValidity();
    // }
  }

  getFormData() {
    return this.formAsignarContrasena.value;
  }

  setFormData(data: any) {
    if (data) {
      this.formularioDenunciaService.setFormData(this.route.snapshot.routeConfig?.path!, data);
    }
  }

  get isValid(): boolean {
    return this.formAsignarContrasena.valid;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) return null;

    const errors: ValidationErrors = {};
    if (!/[A-Z]/.test(value)) errors['noUpperCase'] = true;
    if (!/[a-z]/.test(value)) errors['noLowerCase'] = true;
    if (!/[0-9]/.test(value)) errors['noNumber'] = true;
    if (!/[^A-Za-z0-9]/.test(value)) errors['noSpecialChar'] = true;
    if (value.length < 8) errors['shortPassword'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('Contrasena')?.value;
    const confirmPassword = group.get('RepetirContrasena')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  togglePasswordVisibility(field: 'password' | 'repeatPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showRepeatPassword = !this.showRepeatPassword;
    }
  }
}