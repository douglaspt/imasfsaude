import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBeneficiario, Beneficiario } from '../beneficiario.model';
import { BeneficiarioService } from '../service/beneficiario.service';
import { ICep } from 'app/entities/cep/cep.model';
import { CepService } from 'app/entities/cep/service/cep.service';
import { IPlano } from 'app/entities/plano/plano.model';
import { PlanoService } from 'app/entities/plano/service/plano.service';

@Component({
  selector: 'jhi-beneficiario-update',
  templateUrl: './beneficiario-update.component.html',
})
export class BeneficiarioUpdateComponent implements OnInit {
  isSaving = false;

  cepsCollection: ICep[] = [];
  planosCollection: IPlano[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    cpf: [],
    rg: [],
    email: [],
    status: [],
    cep: [],
    plano: [],
  });

  constructor(
    protected beneficiarioService: BeneficiarioService,
    protected cepService: CepService,
    protected planoService: PlanoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ beneficiario }) => {
      this.updateForm(beneficiario);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const beneficiario = this.createFromForm();
    if (beneficiario.id !== undefined) {
      this.subscribeToSaveResponse(this.beneficiarioService.update(beneficiario));
    } else {
      this.subscribeToSaveResponse(this.beneficiarioService.create(beneficiario));
    }
  }

  trackCepById(index: number, item: ICep): number {
    return item.id!;
  }

  trackPlanoById(index: number, item: IPlano): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBeneficiario>>): void {
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

  protected updateForm(beneficiario: IBeneficiario): void {
    this.editForm.patchValue({
      id: beneficiario.id,
      nome: beneficiario.nome,
      cpf: beneficiario.cpf,
      rg: beneficiario.rg,
      email: beneficiario.email,
      status: beneficiario.status,
      cep: beneficiario.cep,
      plano: beneficiario.plano,
    });

    this.cepsCollection = this.cepService.addCepToCollectionIfMissing(this.cepsCollection, beneficiario.cep);
    this.planosCollection = this.planoService.addPlanoToCollectionIfMissing(this.planosCollection, beneficiario.plano);
  }

  protected loadRelationshipsOptions(): void {
    this.cepService
      .query({ filter: 'beneficiario-is-null' })
      .pipe(map((res: HttpResponse<ICep[]>) => res.body ?? []))
      .pipe(map((ceps: ICep[]) => this.cepService.addCepToCollectionIfMissing(ceps, this.editForm.get('cep')!.value)))
      .subscribe((ceps: ICep[]) => (this.cepsCollection = ceps));

    this.planoService
      .query({ filter: 'beneficiario-is-null' })
      .pipe(map((res: HttpResponse<IPlano[]>) => res.body ?? []))
      .pipe(map((planos: IPlano[]) => this.planoService.addPlanoToCollectionIfMissing(planos, this.editForm.get('plano')!.value)))
      .subscribe((planos: IPlano[]) => (this.planosCollection = planos));
  }

  protected createFromForm(): IBeneficiario {
    return {
      ...new Beneficiario(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      cpf: this.editForm.get(['cpf'])!.value,
      rg: this.editForm.get(['rg'])!.value,
      email: this.editForm.get(['email'])!.value,
      status: this.editForm.get(['status'])!.value,
      cep: this.editForm.get(['cep'])!.value,
      plano: this.editForm.get(['plano'])!.value,
    };
  }
}
