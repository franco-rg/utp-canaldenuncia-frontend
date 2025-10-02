import { NgModule } from "@angular/core";
import { PanelComponent } from "./panel.component";
import { RouterModule, Routes } from "@angular/router";
import { EquipoGestorComponent } from "./equipo-gestor/equipo-gestor.component";
import { TipoDenunciaComponent } from "./tipo-denuncia/tipo-denuncia.component";
import { RelacionEmpresaComponent } from "./relacion-empresa/relacion-empresa.component";
import { MisDenunciasComponent } from "./mis-denuncias/mis-denuncias.component";
import { DenunciaComponent } from "./denuncia/denuncia.component";
import { RolesGestorComponent } from "./roles-gestor/roles-gestor.component";
import { MedidasCautelaresComponent } from "./medidas-cautelares/medidas-cautelares.component";
import { ParametrosComponent } from "./parametros/parametros.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PerfilComponent } from "./perfil/perfil.component";

const routes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard',
        component: DashboardComponent
      },
      { 
        path: 'Equipo',
        component: EquipoGestorComponent
      },
      {
        path: 'roles-gestor',
        component: RolesGestorComponent
      },
      {
        path: 'tipo-denuncia',
        component: TipoDenunciaComponent
      },
      {
        path: 'relacion-empresa',
        component: RelacionEmpresaComponent
      },
      { 
        path: 'mis-denuncias',
        component: MisDenunciasComponent
      },
      {
        path: 'denuncia/:id',
        component: DenunciaComponent
      },
      {
        path: 'medidas-cautelares',
        component: MedidasCautelaresComponent
      },
      {
        path: 'parametros',
        component: ParametrosComponent
      },
      {
        path: 'perfil',
        component: PerfilComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }