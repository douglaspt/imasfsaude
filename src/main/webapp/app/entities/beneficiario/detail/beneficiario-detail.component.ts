import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBeneficiario } from '../beneficiario.model';

@Component({
  selector: 'jhi-beneficiario-detail',
  templateUrl: './beneficiario-detail.component.html',
})
export class BeneficiarioDetailComponent implements OnInit {
  beneficiario: IBeneficiario | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ beneficiario }) => {
      this.beneficiario = beneficiario;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
