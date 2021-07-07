import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IConveniado, Conveniado } from '../conveniado.model';
import { ConveniadoService } from '../service/conveniado.service';
import { ICep } from 'app/entities/cep/cep.model';
import { CepService } from 'app/entities/cep/service/cep.service';

@Component({
  selector: 'jhi-conveniado-update',
  templateUrl: './conveniado-update.component.html',
})
export class ConveniadoUpdateComponent implements OnInit {
  isSaving = false;

  cepsCollection: ICep[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    cnpj: [],
    contrato: [],
    rg: [],
    email: [],
    telefone: [],
    status: [],
    cep: [],
  });

  constructor(
    protected conveniadoService: ConveniadoService,
    protected cepService: CepService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conveniado }) => {
      this.updateForm(conveniado);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const conveniado = this.createFromForm();
    if (conveniado.id !== undefined) {
      this.subscribeToSaveResponse(this.conveniadoService.update(conveniado));
    } else {
      this.subscribeToSaveResponse(this.conveniadoService.create(conveniado));
    }
  }

  trackCepById(index: number, item: ICep): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConveniado>>): void {
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

  protected updateForm(conveniado: IConveniado): void {
    this.editForm.patchValue({
      id: conveniado.id,
      nome: conveniado.nome,
      cnpj: conveniado.cnpj,
      contrato: conveniado.contrato,
      rg: conveniado.rg,
      email: conveniado.email,
      telefone: conveniado.telefone,
      status: conveniado.status,
      cep: conveniado.cep,
    });

    this.cepsCollection = this.cepService.addCepToCollectionIfMissing(this.cepsCollection, conveniado.cep);
  }

  protected loadRelationshipsOptions(): void {
    this.cepService
      .query({ filter: 'conveniado-is-null' })
      .pipe(map((res: HttpResponse<ICep[]>) => res.body ?? []))
      .pipe(map((ceps: ICep[]) => this.cepService.addCepToCollectionIfMissing(ceps, this.editForm.get('cep')!.value)))
      .subscribe((ceps: ICep[]) => (this.cepsCollection = ceps));
  }

  protected createFromForm(): IConveniado {
    return {
      ...new Conveniado(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      cnpj: this.editForm.get(['cnpj'])!.value,
      contrato: this.editForm.get(['contrato'])!.value,
      rg: this.editForm.get(['rg'])!.value,
      email: this.editForm.get(['email'])!.value,
      telefone: this.editForm.get(['telefone'])!.value,
      status: this.editForm.get(['status'])!.value,
      cep: this.editForm.get(['cep'])!.value,
    };
  }
}
