import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProcedimento } from '../procedimento.model';
import { ProcedimentoService } from '../service/procedimento.service';
import { ProcedimentoDeleteDialogComponent } from '../delete/procedimento-delete-dialog.component';

@Component({
  selector: 'jhi-procedimento',
  templateUrl: './procedimento.component.html',
})
export class ProcedimentoComponent implements OnInit {
  procedimentos?: IProcedimento[];
  isLoading = false;

  constructor(protected procedimentoService: ProcedimentoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.procedimentoService.query().subscribe(
      (res: HttpResponse<IProcedimento[]>) => {
        this.isLoading = false;
        this.procedimentos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProcedimento): number {
    return item.id!;
  }

  delete(procedimento: IProcedimento): void {
    const modalRef = this.modalService.open(ProcedimentoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.procedimento = procedimento;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
