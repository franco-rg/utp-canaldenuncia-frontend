import { NgModule } from "@angular/core";
import { PanelComponent } from "./panel.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PanelRoutingModule } from "./panel-routing.module";
import { TableComponent } from "src/resources/components/table.component/table.component.component";
import { EquipoGestorComponent } from "./equipo-gestor/equipo-gestor.component";
import { TipoDenunciaComponent } from "./tipo-denuncia/tipo-denuncia.component";
import { RelacionEmpresaComponent } from "./relacion-empresa/relacion-empresa.component";
import { MisDenunciasComponent } from "./mis-denuncias/mis-denuncias.component";
import { DenunciaComponent } from "./denuncia/denuncia.component";
import { SharedModule } from "../layout/loader/loader.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalAgregarGestorComponent } from "./equipo-gestor/modales/modal-agregar-gestor/modal-agregar-gestor.component";
import { RolesGestorComponent } from "./roles-gestor/roles-gestor.component";
import { ModalRolGestorAgregarComponent } from "./roles-gestor/modales/modal-rol-gestor-agregar/modal-rol-gestor-agregar.component";
import { ModalRolGestorEditarComponent } from "./roles-gestor/modales/modal-rol-gestor-editar/modal-rol-gestor-editar.component";
import { ModalTipoDenunciaAgregarComponent } from "./tipo-denuncia/modales/modal-tipo-denuncia-agregar/modal-tipo-denuncia-agregar.component";
import { ModalTipoDenunciaEditarComponent } from "./tipo-denuncia/modales/modal-tipo-denuncia-editar/modal-tipo-denuncia-editar.component";
import { ModalRelacionEmpresaAgregarComponent } from "./relacion-empresa/modales/modal-relacion-empresa-agregar/modal-relacion-empresa-agregar.component";
import { ModalRelacionEmpresaEditarComponent } from "./relacion-empresa/modales/modal-relacion-empresa-editar/modal-relacion-empresa-editar.component";
import { ModalEditarGestorComponent } from "./equipo-gestor/modales/modal-editar-gestor/modal-editar-gestor.component";
import { MedidasCautelaresComponent } from "./medidas-cautelares/medidas-cautelares.component";
import { ModalMedidaCautelarAgregarComponent } from "./medidas-cautelares/modales/modal-medida-cautelar-agregar/modal-medida-cautelar-agregar.component";
import { ModalMedidaCautelarEditarComponent } from "./medidas-cautelares/modales/modal-medida-cautelar-editar/modal-medida-cautelar-editar.component";
import { ParametrosComponent } from "./parametros/parametros.component";
import { ModalParametroAgregarComponent } from "./parametros/modales/modal-parametro-agregar/modal-parametro-agregar.component";
import { ModalParametroEditarComponent } from "./parametros/modales/modal-parametro-editar/modal-parametro-editar.component";
import { ModalModificarTipoDenunciaComponent } from "./denuncia/modales/modal-modificar-tipo-denuncia/modal-modificar-tipo-denuncia.component";
import { ModalAsignarInvestigadorComponent } from "./denuncia/modales/modal-asignar-investigador/modal-asignar-investigador.component";
import { ModalTestigoAgregarComponent } from "./denuncia/modales/modal-testigo-agregar/modal-testigo-agregar.component";
import { ModalDocumentoAgregarComponent } from "./denuncia/modales/modal-documento-agregar/modal-documento-agregar.component";
import { ModalAsignarDecisorComponent } from "./denuncia/modales/modal-asignar-decisor/modal-asignar-decisor.component";
import { ModalAccionAgregarComponent } from "./denuncia/modales/modal-accion-agregar/modal-accion-agregar.component";
import { ModalArchivarDenunciaAgregarComponent } from "./denuncia/modales/modal-archivar-denuncia-agregar/modal-archivar-denuncia-agregar.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { PerfilComponent } from "./perfil/perfil.component";

@NgModule({
    declarations: [
        PanelComponent,
        TableComponent,
        DashboardComponent,
        // DENUNCIA
        MisDenunciasComponent,
        DenunciaComponent,
        ModalModificarTipoDenunciaComponent,
        ModalAsignarInvestigadorComponent,
        ModalTestigoAgregarComponent,
        ModalDocumentoAgregarComponent,
        ModalAsignarDecisorComponent,
        ModalAccionAgregarComponent,
        ModalArchivarDenunciaAgregarComponent,

        // RELACION EMPRESA
        RelacionEmpresaComponent,
        ModalRelacionEmpresaAgregarComponent,
        ModalRelacionEmpresaEditarComponent,
          
        // TIPOS DE DENUNCIA
        TipoDenunciaComponent, 
        ModalTipoDenunciaAgregarComponent,
        ModalTipoDenunciaEditarComponent,
        
        // ROLES
        RolesGestorComponent,
        ModalRolGestorAgregarComponent,
        ModalRolGestorEditarComponent,

        // EQUIPO GESTOR
        EquipoGestorComponent, 
        ModalAgregarGestorComponent,
        ModalEditarGestorComponent,

        // MEDIDA CAUTELAR
        MedidasCautelaresComponent,
        ModalMedidaCautelarAgregarComponent,
        ModalMedidaCautelarEditarComponent,

        // PARAMETRO
        ParametrosComponent,
        ModalParametroAgregarComponent,
        ModalParametroEditarComponent,

        PerfilComponent

    ],
    imports: [
        CommonModule,
        RouterModule,
        PanelRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgxChartsModule
    ],
})
export class PanelModule { }