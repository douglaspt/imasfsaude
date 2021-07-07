import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConveniado } from '../conveniado.model';

@Component({
  selector: 'jhi-conveniado-detail',
  templateUrl: './conveniado-detail.component.html',
})
export class ConveniadoDetailComponent implements OnInit {
  conveniado: IConveniado | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conveniado }) => {
      this.conveniado = conveniado;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
