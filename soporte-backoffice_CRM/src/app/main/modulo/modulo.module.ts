import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModuloComponent } from "./R_modulo/modulo.component";
import { ListarModuloComponent } from './listar-modulo/listar-modulo.component';
import { DashboardService } from "../dashboard/dashboard.service";
import { AuthGuard } from "app/auth/helpers";
import { ModuloService } from "./modulo.service";
import { data } from "autoprefixer";

const routes: Routes = [
  {
    path: "registrar-modulo",
    component: ModuloComponent,
    data: { animation: "decommerce" },
  },
  {
    path: "list-modulos",
    component: ListarModuloComponent,
    data: { animation: "decommerce" },
  },
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    ListarModuloComponent,
    ModuloComponent
  ],
  providers: [
    DashboardService,
    ModuloService,
    AuthGuard,
    NgbActiveModal
  ],
  exports: []
})
export class ModuloModule { }