import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/resources/services/auth.service';
import { NotyfService } from 'src/resources/services/dependences/notyf.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private notyf: NotyfService) {
    this.loginForm = new FormGroup({
      Correo: new FormControl('', [ Validators.required, Validators.email ]),
      Contrasena: new FormControl('', [ Validators.required ])
    });
  }

  ngOnInit() {
  }

  breadcrumb = [
    { label: 'Inicio', url: '/inicio' },
    { label: 'Iniciar sesión', url: '/iniciar-sesion' }
  ];

  login() {
    if (this.loginForm.invalid) {
      this.notyf.error('Por favor, complete todos los campos.');
      return;
    }

    const { Correo, Contrasena } = this.loginForm.value;
    const formData = new FormData();
    formData.append('CORREO', Correo);
    formData.append('PASSWORD', Contrasena);

    this.authService.login(formData).subscribe(
      (response) => {
        if(!response.success) return this.notyf.error(response.error);
        this.router.navigate(['/panel']);
        this.notyf.success('Inicio de sesión exitoso.');
      },
      (error) => {
        this.notyf.error(error.error?.message || 'Error de conexión');
      }
    );
  }
}