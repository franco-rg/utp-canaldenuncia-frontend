import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PonerDenunciaComponent } from "./poner-denuncia.component";
// import { PonerDenunciaRoutingModule } from "./poner-denuncia-routing.module";

@NgModule({
    declarations: [
        PonerDenunciaComponent,
    ],
    imports: [
        CommonModule,
        // PonerDenunciaRoutingModule,
    ]
})
export class PonerDenunciaModule {};