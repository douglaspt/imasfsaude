import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICep } from '../cep.model';

@Component({
  selector: 'jhi-cep-detail',
  templateUrl: './cep-detail.component.html',
})
export class CepDetailComponent implements OnInit {
  cep: ICep | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cep }) => {
      this.cep = cep;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
