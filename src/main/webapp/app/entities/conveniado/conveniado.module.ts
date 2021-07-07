import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ConveniadoComponent } from './list/conveniado.component';
import { ConveniadoDetailComponent } from './detail/conveniado-detail.component';
import { ConveniadoUpdateComponent } from './update/conveniado-update.component';
import { ConveniadoDeleteDialogComponent } from './delete/conveniado-delete-dialog.component';
import { ConveniadoRoutingModule } from './route/conveniado-routing.module';

@NgModule({
  imports: [SharedModule, ConveniadoRoutingModule],
  declarations: [ConveniadoComponent, ConveniadoDetailComponent, ConveniadoUpdateComponent, ConveniadoDeleteDialogComponent],
  entryComponents: [ConveniadoDeleteDialogComponent],
})
export class ConveniadoModule {}
