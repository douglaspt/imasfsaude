import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBeneficiario } from '../beneficiario.model';
import { BeneficiarioService } from '../service/beneficiario.service';

@Component({
  templateUrl: './beneficiario-delete-dialog.component.html',
})
export class BeneficiarioDeleteDialogComponent {
  beneficiario?: IBeneficiario;

  constructor(protected beneficiarioService: BeneficiarioService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.beneficiarioService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
