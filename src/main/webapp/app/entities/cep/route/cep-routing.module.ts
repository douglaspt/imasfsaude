import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CepComponent } from '../list/cep.component';
import { CepDetailComponent } from '../detail/cep-detail.component';
import { CepUpdateComponent } from '../update/cep-update.component';
import { CepRoutingResolveService } from './cep-routing-resolve.service';

const cepRoute: Routes = [
  {
    path: '',
    component: CepComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CepDetailComponent,
    resolve: {
      cep: CepRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CepUpdateComponent,
    resolve: {
      cep: CepRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CepUpdateComponent,
    resolve: {
      cep: CepRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cepRoute)],
  exports: [RouterModule],
})
export class CepRoutingModule {}
