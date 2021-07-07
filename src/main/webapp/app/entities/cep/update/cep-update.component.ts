import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICep, Cep } from '../cep.model';
import { CepService } from '../service/cep.service';

@Component({
  selector: 'jhi-cep-update',
  templateUrl: './cep-update.component.html',
})
export class CepUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    logradouro: [],
    bairro: [],
    cidade: [],
    uF: [],
  });

  constructor(protected cepService: CepService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cep }) => {
      this.updateForm(cep);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cep = this.createFromForm();
    if (cep.id !== undefined) {
      this.subscribeToSaveResponse(this.cepService.update(cep));
    } else {
      this.subscribeToSaveResponse(this.cepService.create(cep));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICep>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(cep: ICep): void {
    this.editForm.patchValue({
      id: cep.id,
      logradouro: cep.logradouro,
      bairro: cep.bairro,
      cidade: cep.cidade,
      uF: cep.uF,
    });
  }

  protected createFromForm(): ICep {
    return {
      ...new Cep(),
      id: this.editForm.get(['id'])!.value,
      logradouro: this.editForm.get(['logradouro'])!.value,
      bairro: this.editForm.get(['bairro'])!.value,
      cidade: this.editForm.get(['cidade'])!.value,
      uF: this.editForm.get(['uF'])!.value,
    };
  }
}
