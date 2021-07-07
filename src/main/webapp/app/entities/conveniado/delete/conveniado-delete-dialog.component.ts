import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConveniado } from '../conveniado.model';
import { ConveniadoService } from '../service/conveniado.service';

@Component({
  templateUrl: './conveniado-delete-dialog.component.html',
})
export class ConveniadoDeleteDialogComponent {
  conveniado?: IConveniado;

  constructor(protected conveniadoService: ConveniadoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.conveniadoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
