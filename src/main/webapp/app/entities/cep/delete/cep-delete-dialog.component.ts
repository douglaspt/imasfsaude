import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICep } from '../cep.model';
import { CepService } from '../service/cep.service';

@Component({
  templateUrl: './cep-delete-dialog.component.html',
})
export class CepDeleteDialogComponent {
  cep?: ICep;

  constructor(protected cepService: CepService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cepService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
