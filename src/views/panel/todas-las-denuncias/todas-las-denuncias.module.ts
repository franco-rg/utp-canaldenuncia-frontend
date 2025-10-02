import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TodasLasDenunciasComponent } from "./todas-las-denuncias.component";

const routes: Routes = [
  { path: '', component: TodasLasDenunciasComponent }
];

@NgModule({
    declarations: [
        TodasLasDenunciasComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        TodasLasDenunciasComponent
    ]
})
export class TodasLasDenunciasModule { }