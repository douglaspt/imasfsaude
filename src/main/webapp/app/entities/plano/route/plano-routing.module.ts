import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PlanoComponent } from '../list/plano.component';
import { PlanoDetailComponent } from '../detail/plano-detail.component';
import { PlanoUpdateComponent } from '../update/plano-update.component';
import { PlanoRoutingResolveService } from './plano-routing-resolve.service';

const planoRoute: Routes = [
  {
    path: '',
    component: PlanoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlanoDetailComponent,
    resolve: {
      plano: PlanoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlanoUpdateComponent,
    resolve: {
      plano: PlanoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlanoUpdateComponent,
    resolve: {
      plano: PlanoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(planoRoute)],
  exports: [RouterModule],
})
export class PlanoRoutingModule {}
