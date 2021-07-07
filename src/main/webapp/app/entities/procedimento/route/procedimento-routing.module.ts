import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProcedimentoComponent } from '../list/procedimento.component';
import { ProcedimentoDetailComponent } from '../detail/procedimento-detail.component';
import { ProcedimentoUpdateComponent } from '../update/procedimento-update.component';
import { ProcedimentoRoutingResolveService } from './procedimento-routing-resolve.service';

const procedimentoRoute: Routes = [
  {
    path: '',
    component: ProcedimentoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProcedimentoDetailComponent,
    resolve: {
      procedimento: ProcedimentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProcedimentoUpdateComponent,
    resolve: {
      procedimento: ProcedimentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProcedimentoUpdateComponent,
    resolve: {
      procedimento: ProcedimentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(procedimentoRoute)],
  exports: [RouterModule],
})
export class ProcedimentoRoutingModule {}
