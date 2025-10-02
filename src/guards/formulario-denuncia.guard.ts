import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FormularioDenunciaService } from '../resources/services/modulos/poner-denuncia/formulario-denuncia.service';

@Injectable({
  providedIn: 'root'
})
export class FormularioDenunciaGuard implements CanActivate {

  constructor(private formularioService: FormularioDenunciaService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const formData = this.formularioService.getFormDataAll();
    const isEmpty = Object.keys(formData).length === 0;
    const isFirstStep = state.url.includes('datos-hecho');

    if (isEmpty && !isFirstStep) {
      this.router.navigate(['/modulos/poner-denuncia/datos-hecho']);
      return false;
    }
    
    return true;
  }
}