import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { EtiqueteraComponent } from './etiquetera.component';

import { CourseSharedService } from '../service/course-shared.service'
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardService } from '../dashboard.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { EtiqueteraService } from '../service/etiquetera.service';
import { AuthGuard } from 'app/auth/helpers';

const routes: Routes = [
  {
    path: 'registrar-curso',
    component: EtiqueteraComponent,
    data: { animation: 'decommerce' },
  },
];

@NgModule({
  declarations: [EtiqueteraComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule,
    PerfectScrollbarModule,
    NgxDatatableModule,
    CardSnippetModule
  ],
  providers: [
    CourseSharedService,
    EtiqueteraService,
    AuthGuard,
    DashboardService
  ],
}) export class EtiqueteraModule { }
