import { repeaterAnimation } from 'app/main/forms/form-repeater/form-repeater.animation';
import { CommonModule } from "@angular/common";
import { RClausulaComponent } from "./r-clausula/r-clausula.component";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClausulaService } from "./clausula.service";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ListarClausulaComponent } from './listar-clausula/listar-clausula.component';

const routes: Routes = [
  {
    path: "registrar-clausula",
    component: RClausulaComponent,
    data: { animation: "decommerce" },
  },
  {
    path: "listar-clausula",
    component: ListarClausulaComponent,
    data: { animation: "listarClausula" }
  }
]

@NgModule({
  declarations: [RClausulaComponent, ListarClausulaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
  ],
  providers: [ClausulaService, NgbActiveModal],
  exports: [],
})
export class ClausulaModule { }
