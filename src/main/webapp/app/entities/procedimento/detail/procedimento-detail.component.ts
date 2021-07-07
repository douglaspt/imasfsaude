import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProcedimento } from '../procedimento.model';

@Component({
  selector: 'jhi-procedimento-detail',
  templateUrl: './procedimento-detail.component.html',
})
export class ProcedimentoDetailComponent implements OnInit {
  procedimento: IProcedimento | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ procedimento }) => {
      this.procedimento = procedimento;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
