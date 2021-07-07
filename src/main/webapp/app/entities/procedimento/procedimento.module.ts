import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ProcedimentoComponent } from './list/procedimento.component';
import { ProcedimentoDetailComponent } from './detail/procedimento-detail.component';
import { ProcedimentoUpdateComponent } from './update/procedimento-update.component';
import { ProcedimentoDeleteDialogComponent } from './delete/procedimento-delete-dialog.component';
import { ProcedimentoRoutingModule } from './route/procedimento-routing.module';

@NgModule({
  imports: [SharedModule, ProcedimentoRoutingModule],
  declarations: [ProcedimentoComponent, ProcedimentoDetailComponent, ProcedimentoUpdateComponent, ProcedimentoDeleteDialogComponent],
  entryComponents: [ProcedimentoDeleteDialogComponent],
})
export class ProcedimentoModule {}
