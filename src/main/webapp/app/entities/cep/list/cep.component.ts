import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICep } from '../cep.model';
import { CepService } from '../service/cep.service';
import { CepDeleteDialogComponent } from '../delete/cep-delete-dialog.component';

@Component({
  selector: 'jhi-cep',
  templateUrl: './cep.component.html',
})
export class CepComponent implements OnInit {
  ceps?: ICep[];
  isLoading = false;

  constructor(protected cepService: CepService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.cepService.query().subscribe(
      (res: HttpResponse<ICep[]>) => {
        this.isLoading = false;
        this.ceps = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICep): number {
    return item.id!;
  }

  delete(cep: ICep): void {
    const modalRef = this.modalService.open(CepDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cep = cep;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
