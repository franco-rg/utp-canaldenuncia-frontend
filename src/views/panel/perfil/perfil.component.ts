import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CanalAdminService } from 'src/resources/services/canalAdmin/canalAdmin.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent {

  form!: FormGroup;
  loading: boolean = false;
  datos: any = {};

  constructor(
    private fb: FormBuilder,
    private canalAdminService: CanalAdminService,
    private notyf: NotyfService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      NOMBRS: ['', Validators.required],
      SNOMBRS: [''],
      APLLDS: ['', Validators.required],
      SAPLLDS: [''],
      DCUMNTO: ['', Validators.required],
      CORREO: ['', [Validators.required, Validators.email]],
      PASSWORD: [''],
      IDMRCA: [''],
      IDROL: [''],
      ANEXO: [''],
      PRMSO: [''],
    });

    this.findUser();
  }

  cerrar() {
    this.form.reset();
  }

  findUser() {
    this.loading = true;
    this.canalAdminService.getUsuario().subscribe({
      next: (res) => {
        if (res.length == 0) {
          this.loading = false;
          this.notyf.error('No se encontró el usuario');
          return;
        }
        let data = res[0];
        this.form.patchValue({
          NOMBRS: data.nombrs,
          SNOMBRS: data.snombrs,
          APLLDS: data.apllds,
          SAPLLDS: data.sapllds,
          DCUMNTO: data.dcumnto,
          CORREO: data.correo,
          PASSWORD: "",
          IDMRCA: data.idmrca,
          IDROL: data.idrol,
          ANEXO: data.anexo,
          PRMSO: data.prmso,
        });
        this.datos = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notyf.error(err.error.message);
      },
    });
  }

  enviar() {
    if (!this.form.valid) return this.form.markAllAsTouched();

    let formData = new FormData();
    formData.append('IDROL', this.datos.idrol);
    formData.append('IDMRCA', this.datos.idmrca);
    formData.append('NOMBRS', this.form.get('NOMBRS')?.value);
    formData.append('SNOMBRS', this.form.get('SNOMBRS')?.value);
    formData.append('APLLDS', this.form.get('APLLDS')?.value);
    formData.append('SAPLLDS', this.form.get('SAPLLDS')?.value);
    formData.append('DCUMNTO', this.form.get('DCUMNTO')?.value);
    formData.append('CORREO', this.form.get('CORREO')?.value);
    formData.append('PASSWORD', this.form.get('PASSWORD')?.value || "");
    formData.append('ANEXO', this.form.get('ANEXO')?.value);
    formData.append('PRMSO', this.datos.prmso);
    formData.append('DELETE', "false");
    formData.append('CESTDO', this.datos.cestdo);
    formData.append('RTAFTO', this.datos.rtafto);

    this.loading = true;
    this.canalAdminService.postUpdateUser(formData).subscribe({
      next: (res) => {
        if (res.codEstado > 0 && res.esSatisfactoria) {
          this.notyf.success('Datos actualizados correctamente');
          this.findUser();
        } else {
          this.notyf.error('Error al actualizar los datos');
        }
      },
      error: () => {
        this.notyf.error('Error al actualizar los datos');
      },
      complete: () => {
        this.loading = false;
      },
    });



  }
}
