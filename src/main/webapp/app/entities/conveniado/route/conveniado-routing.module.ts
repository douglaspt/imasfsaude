import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConveniadoComponent } from '../list/conveniado.component';
import { ConveniadoDetailComponent } from '../detail/conveniado-detail.component';
import { ConveniadoUpdateComponent } from '../update/conveniado-update.component';
import { ConveniadoRoutingResolveService } from './conveniado-routing-resolve.service';

const conveniadoRoute: Routes = [
  {
    path: '',
    component: ConveniadoComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConveniadoDetailComponent,
    resolve: {
      conveniado: ConveniadoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConveniadoUpdateComponent,
    resolve: {
      conveniado: ConveniadoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConveniadoUpdateComponent,
    resolve: {
      conveniado: ConveniadoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(conveniadoRoute)],
  exports: [RouterModule],
})
export class ConveniadoRoutingModule {}
