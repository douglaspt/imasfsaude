import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProcedimento, Procedimento } from '../procedimento.model';
import { ProcedimentoService } from '../service/procedimento.service';
import { IConta } from 'app/entities/conta/conta.model';
import { ContaService } from 'app/entities/conta/service/conta.service';

@Component({
  selector: 'jhi-procedimento-update',
  templateUrl: './procedimento-update.component.html',
})
export class ProcedimentoUpdateComponent implements OnInit {
  isSaving = false;

  contasSharedCollection: IConta[] = [];

  editForm = this.fb.group({
    id: [],
    descricao: [],
    quantidade: [],
    valorInformado: [],
    valorPago: [],
    glosa: [],
    conta: [],
  });

  constructor(
    protected procedimentoService: ProcedimentoService,
    protected contaService: ContaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ procedimento }) => {
      this.updateForm(procedimento);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const procedimento = this.createFromForm();
    if (procedimento.id !== undefined) {
      this.subscribeToSaveResponse(this.procedimentoService.update(procedimento));
    } else {
      this.subscribeToSaveResponse(this.procedimentoService.create(procedimento));
    }
  }

  trackContaById(index: number, item: IConta): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProcedimento>>): void {
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

  protected updateForm(procedimento: IProcedimento): void {
    this.editForm.patchValue({
      id: procedimento.id,
      descricao: procedimento.descricao,
      quantidade: procedimento.quantidade,
      valorInformado: procedimento.valorInformado,
      valorPago: procedimento.valorPago,
      glosa: procedimento.glosa,
      conta: procedimento.conta,
    });

    this.contasSharedCollection = this.contaService.addContaToCollectionIfMissing(this.contasSharedCollection, procedimento.conta);
  }

  protected loadRelationshipsOptions(): void {
    this.contaService
      .query()
      .pipe(map((res: HttpResponse<IConta[]>) => res.body ?? []))
      .pipe(map((contas: IConta[]) => this.contaService.addContaToCollectionIfMissing(contas, this.editForm.get('conta')!.value)))
      .subscribe((contas: IConta[]) => (this.contasSharedCollection = contas));
  }

  protected createFromForm(): IProcedimento {
    return {
      ...new Procedimento(),
      id: this.editForm.get(['id'])!.value,
      descricao: this.editForm.get(['descricao'])!.value,
      quantidade: this.editForm.get(['quantidade'])!.value,
      valorInformado: this.editForm.get(['valorInformado'])!.value,
      valorPago: this.editForm.get(['valorPago'])!.value,
      glosa: this.editForm.get(['glosa'])!.value,
      conta: this.editForm.get(['conta'])!.value,
    };
  }
}
