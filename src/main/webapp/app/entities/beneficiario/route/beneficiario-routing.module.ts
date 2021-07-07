import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BeneficiarioComponent } from '../list/beneficiario.component';
import { BeneficiarioDetailComponent } from '../detail/beneficiario-detail.component';
import { BeneficiarioUpdateComponent } from '../update/beneficiario-update.component';
import { BeneficiarioRoutingResolveService } from './beneficiario-routing-resolve.service';

const beneficiarioRoute: Routes = [
  {
    path: '',
    component: BeneficiarioComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BeneficiarioDetailComponent,
    resolve: {
      beneficiario: BeneficiarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BeneficiarioUpdateComponent,
    resolve: {
      beneficiario: BeneficiarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BeneficiarioUpdateComponent,
    resolve: {
      beneficiario: BeneficiarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(beneficiarioRoute)],
  exports: [RouterModule],
})
export class BeneficiarioRoutingModule {}
