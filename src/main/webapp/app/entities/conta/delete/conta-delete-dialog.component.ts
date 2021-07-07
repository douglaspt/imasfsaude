import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConta } from '../conta.model';
import { ContaService } from '../service/conta.service';

@Component({
  templateUrl: './conta-delete-dialog.component.html',
})
export class ContaDeleteDialogComponent {
  conta?: IConta;

  constructor(protected contaService: ContaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.contaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
