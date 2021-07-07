import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CepComponent } from './list/cep.component';
import { CepDetailComponent } from './detail/cep-detail.component';
import { CepUpdateComponent } from './update/cep-update.component';
import { CepDeleteDialogComponent } from './delete/cep-delete-dialog.component';
import { CepRoutingModule } from './route/cep-routing.module';

@NgModule({
  imports: [SharedModule, CepRoutingModule],
  declarations: [CepComponent, CepDetailComponent, CepUpdateComponent, CepDeleteDialogComponent],
  entryComponents: [CepDeleteDialogComponent],
})
export class CepModule {}
