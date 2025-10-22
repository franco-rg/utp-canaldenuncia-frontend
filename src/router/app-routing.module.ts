import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/guards/auth.guard";
import { FormularioDenunciaGuard } from "src/guards/formulario-denuncia.guard";
import { LoginGuard } from "src/guards/login.guard";
import { IniciarSesionComponent } from "src/views/iniciar-sesion/iniciar-sesion.component";
import { InicioComponent } from "src/views/inicio/inicio.component";
import { LayoutComponent } from "src/views/layout/layout.component";
import { ModulosComponent } from "src/views/modulos/modulos.component";
import { AsignarContrasenaComponent } from "src/views/modulos/poner-denuncia/asignar-contrasena/asignar-contrasena.component";
import { DatosArchivosComponent } from "src/views/modulos/poner-denuncia/datos-archivos/datos-archivos.component";
import { DatosDenunciaComponent } from "src/views/modulos/poner-denuncia/datos-denuncia/datos-denuncia.component";
import { DatosDenuncianteComponent } from "src/views/modulos/poner-denuncia/datos-denunciante/datos-denunciante.component";
import { DatosHechoComponent } from "src/views/modulos/poner-denuncia/datos-hecho/datos-hecho.component";
import { DatosTestigoComponent } from "src/views/modulos/poner-denuncia/datos-testigo/datos-testigo.component";
import { DatosResolver } from "src/views/modulos/poner-denuncia/DatosResolver.componente";
import { FinalizarDenunciaComponent } from "src/views/modulos/poner-denuncia/finalizar-denuncia/finalizar-denuncia.component";
import { PonerDenunciaComponent } from "src/views/modulos/poner-denuncia/poner-denuncia.component";
import { VisualizarDenunciaComponent } from "src/views/modulos/visualizar-denuncia/visualizar-denuncia.component";
import { PanelComponent } from "src/views/panel/panel.component";

const routes: Routes = [
    { 
        path: '', 
        component: LayoutComponent,  
        children: [
            {
                path: '',
                redirectTo: 'inicio',
                pathMatch: 'full',
            },
            {
                path: 'inicio',
                component: InicioComponent
            }
        ]
    },
    {
        path: 'modulos',
        data: { animation: 'slideIn' },
        children: [
            {
                path: '',
                component: ModulosComponent
            },
            {
                path: 'poner-denuncia',
                component: PonerDenunciaComponent,  
                // resolve: { datos: DatosResolver },
                children: [
                    {
                        path: '',
                        redirectTo: 'datos-hecho',
                        pathMatch: 'full',
                    },
                    {
                        path: 'datos-hecho',
                        component: DatosHechoComponent,
                    },
                    {
                        path: 'datos-denunciante',
                        component: DatosDenuncianteComponent,
                        canActivate: [FormularioDenunciaGuard]
                    },
                    {
                        path: 'datos-denuncia',
                        component: DatosDenunciaComponent,
                        canActivate: [FormularioDenunciaGuard]
                    },
                    {
                        path: 'datos-testigo',
                        component: DatosTestigoComponent,
                        canActivate: [FormularioDenunciaGuard]
                    },
                    {
                        path: 'datos-archivos',
                        component: DatosArchivosComponent,
                        canActivate: [FormularioDenunciaGuard]
                    },
                    {
                        path: 'finalizar-denuncia',
                        component: FinalizarDenunciaComponent,
                        canActivate: [FormularioDenunciaGuard]
                    },
                    {
                        path: 'asignar-contrasena',
                        component: AsignarContrasenaComponent,
                        canActivate: [FormularioDenunciaGuard]
                    }
                ]
            },
            {
                path: 'ver-denuncias',
                component: VisualizarDenunciaComponent
            }
        ]
    },
    {
        path: 'panel',
        loadChildren: () => import('../views/panel/panel.module').then(m => m.PanelModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'iniciar-sesion',
        component: IniciarSesionComponent,
        data: { animation: 'slideIn' },
        canActivate: [LoginGuard]
    },
    {
        path: '**',
        redirectTo: 'inicio'
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {};