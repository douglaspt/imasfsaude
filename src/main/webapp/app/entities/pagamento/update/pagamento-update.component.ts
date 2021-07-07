import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPagamento, Pagamento } from '../pagamento.model';
import { PagamentoService } from '../service/pagamento.service';
import { IConta } from 'app/entities/conta/conta.model';
import { ContaService } from 'app/entities/conta/service/conta.service';

@Component({
  selector: 'jhi-pagamento-update',
  templateUrl: './pagamento-update.component.html',
})
export class PagamentoUpdateComponent implements OnInit {
  isSaving = false;

  contasCollection: IConta[] = [];

  editForm = this.fb.group({
    id: [],
    descricao: [],
    emissao: [],
    vencimento: [],
    valor: [],
    valorDesconto: [],
    valorAcrescimo: [],
    valorPago: [],
    status: [],
    conta: [],
  });

  constructor(
    protected pagamentoService: PagamentoService,
    protected contaService: ContaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pagamento }) => {
      this.updateForm(pagamento);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pagamento = this.createFromForm();
    if (pagamento.id !== undefined) {
      this.subscribeToSaveResponse(this.pagamentoService.update(pagamento));
    } else {
      this.subscribeToSaveResponse(this.pagamentoService.create(pagamento));
    }
  }

  trackContaById(index: number, item: IConta): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPagamento>>): void {
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

  protected updateForm(pagamento: IPagamento): void {
    this.editForm.patchValue({
      id: pagamento.id,
      descricao: pagamento.descricao,
      emissao: pagamento.emissao,
      vencimento: pagamento.vencimento,
      valor: pagamento.valor,
      valorDesconto: pagamento.valorDesconto,
      valorAcrescimo: pagamento.valorAcrescimo,
      valorPago: pagamento.valorPago,
      status: pagamento.status,
      conta: pagamento.conta,
    });

    this.contasCollection = this.contaService.addContaToCollectionIfMissing(this.contasCollection, pagamento.conta);
  }

  protected loadRelationshipsOptions(): void {
    this.contaService
      .query({ filter: 'pagamento-is-null' })
      .pipe(map((res: HttpResponse<IConta[]>) => res.body ?? []))
      .pipe(map((contas: IConta[]) => this.contaService.addContaToCollectionIfMissing(contas, this.editForm.get('conta')!.value)))
      .subscribe((contas: IConta[]) => (this.contasCollection = contas));
  }

  protected createFromForm(): IPagamento {
    return {
      ...new Pagamento(),
      id: this.editForm.get(['id'])!.value,
      descricao: this.editForm.get(['descricao'])!.value,
      emissao: this.editForm.get(['emissao'])!.value,
      vencimento: this.editForm.get(['vencimento'])!.value,
      valor: this.editForm.get(['valor'])!.value,
      valorDesconto: this.editForm.get(['valorDesconto'])!.value,
      valorAcrescimo: this.editForm.get(['valorAcrescimo'])!.value,
      valorPago: this.editForm.get(['valorPago'])!.value,
      status: this.editForm.get(['status'])!.value,
      conta: this.editForm.get(['conta'])!.value,
    };
  }
}
