import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormularioDenunciaService } from 'src/resources/services/modulos/poner-denuncia/formulario-denuncia.service';

@Component({
  selector: 'app-finalizar-denuncia',
  templateUrl: './finalizar-denuncia.component.html',
  styleUrls: ['./finalizar-denuncia.component.css']
})
export class FinalizarDenunciaComponent implements OnInit {
  formFinalizarDenuncia: FormGroup;
  
  constructor(
    private formularioDenunciaService: FormularioDenunciaService,
    private route: ActivatedRoute
  ) {
    this.formFinalizarDenuncia = new FormGroup({
      ComentariosAdicionales: new FormControl(''),
      PoliticaPrivacidad: new FormControl(false, [this.checkboxRequired]),
      TerminosCondiciones: new FormControl(false, [this.checkboxRequired])
    });    
  }

  checkboxRequired: ValidatorFn = (control: AbstractControl) => {
    return control.value === true ? null : { required: true };
  };  

  ngOnInit() {
    const currentPath = this.route.snapshot.routeConfig?.path;
    if (!currentPath) return;

    const savedData = this.formularioDenunciaService.getFormData(currentPath);
    if (savedData) {
      this.formFinalizarDenuncia.patchValue(savedData);
    }
  }

  getFormData() {
    return this.formFinalizarDenuncia.value;
  }

  setFormData(data: any) {
    if (data) {
      this.formFinalizarDenuncia.patchValue(data);
    }
  }

  get isValid(): boolean {
    return this.formFinalizarDenuncia.valid;
  }
}
