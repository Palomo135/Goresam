import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';

import { CoreCommonModule } from '@core/common.module';

import { InvoiceModule } from 'app/main/apps/invoice/invoice.module';
import { InvoiceListService } from 'app/main/apps/invoice/invoice-list/invoice-list.service';

import { DashboardService } from 'app/main/dashboard/dashboard.service';

import { AnalyticsComponent } from 'app/main/dashboard/analytics/analytics.component';
import { EcommerceComponent } from 'app/main/dashboard/ecommerce/ecommerce.component';
import { EtiqueteraComponent } from './etiquetera/etiquetera.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatatablesService } from 'app/main/tables/datatables/datatables.service';
import { CardSnippetModule } from "../../../@core/components/card-snippet/card-snippet.module";
import { ListCursosComponent } from './list-cursos/list-cursos.component';
import { CourseSharedService } from './service/course-shared.service';
import { EtiqueteraModule } from './etiquetera/etiquetera.module';
import { BoxedLayoutModule } from '../ui/page-layouts/boxed-layout/boxed-layout.module';
import { LoaderModule } from './loader/loader.module';
import { LoaderComponent } from './loader/loader.component';




const routes = [
  {
    path: 'analytics',
    component: AnalyticsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin], animation: 'danalytics' },
    resolve: {
      css: DashboardService,
      inv: InvoiceListService
    }
  },
  {
    path: 'ecommerce',
    component: EcommerceComponent,
    canActivate: [AuthGuard],
    resolve: {
      css: DashboardService
    },
    data: { animation: 'decommerce' }
  },
  {
    path: 'registrar-curso',
    component: EtiqueteraComponent,
    canActivate: [AuthGuard],
    resolve: {
      css: DashboardService
    },
    data: { animation: 'decommerce' }
  },
  {
    path: 'list-cursos',
    component: ListCursosComponent,
    canActivate: [AuthGuard],
    resolve: {
      css: DashboardService
    },
    data: { animation: 'decommerce' }
  }
];

@NgModule({
  declarations: [
    AnalyticsComponent,
    EcommerceComponent,
    ListCursosComponent,
    LoaderComponent
  ],
  imports: [
    LoaderModule,
    EtiqueteraModule,
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    InvoiceModule,
    NgxDatatableModule,
    CardSnippetModule
  ],
  providers: [DashboardService, InvoiceListService, DatatablesService, CourseSharedService
  ],
  exports: [EcommerceComponent]
})
export class DashboardModule { }
