import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BeneficiarioComponent } from './list/beneficiario.component';
import { BeneficiarioDetailComponent } from './detail/beneficiario-detail.component';
import { BeneficiarioUpdateComponent } from './update/beneficiario-update.component';
import { BeneficiarioDeleteDialogComponent } from './delete/beneficiario-delete-dialog.component';
import { BeneficiarioRoutingModule } from './route/beneficiario-routing.module';

@NgModule({
  imports: [SharedModule, BeneficiarioRoutingModule],
  declarations: [BeneficiarioComponent, BeneficiarioDetailComponent, BeneficiarioUpdateComponent, BeneficiarioDeleteDialogComponent],
  entryComponents: [BeneficiarioDeleteDialogComponent],
})
export class BeneficiarioModule {}
