import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlano } from '../plano.model';
import { PlanoService } from '../service/plano.service';

@Component({
  templateUrl: './plano-delete-dialog.component.html',
})
export class PlanoDeleteDialogComponent {
  plano?: IPlano;

  constructor(protected planoService: PlanoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.planoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
