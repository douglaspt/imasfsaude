import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PlanoComponent } from './list/plano.component';
import { PlanoDetailComponent } from './detail/plano-detail.component';
import { PlanoUpdateComponent } from './update/plano-update.component';
import { PlanoDeleteDialogComponent } from './delete/plano-delete-dialog.component';
import { PlanoRoutingModule } from './route/plano-routing.module';

@NgModule({
  imports: [SharedModule, PlanoRoutingModule],
  declarations: [PlanoComponent, PlanoDetailComponent, PlanoUpdateComponent, PlanoDeleteDialogComponent],
  entryComponents: [PlanoDeleteDialogComponent],
})
export class PlanoModule {}
