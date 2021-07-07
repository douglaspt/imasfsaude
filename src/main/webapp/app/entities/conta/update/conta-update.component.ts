import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IConta, Conta } from '../conta.model';
import { ContaService } from '../service/conta.service';
import { IBeneficiario } from 'app/entities/beneficiario/beneficiario.model';
import { BeneficiarioService } from 'app/entities/beneficiario/service/beneficiario.service';
import { IConveniado } from 'app/entities/conveniado/conveniado.model';
import { ConveniadoService } from 'app/entities/conveniado/service/conveniado.service';

@Component({
  selector: 'jhi-conta-update',
  templateUrl: './conta-update.component.html',
})
export class ContaUpdateComponent implements OnInit {
  isSaving = false;

  beneficiariosCollection: IBeneficiario[] = [];
  conveniadosCollection: IConveniado[] = [];

  editForm = this.fb.group({
    id: [],
    competencia: [],
    status: [],
    beneficiario: [],
    conveniado: [],
  });

  constructor(
    protected contaService: ContaService,
    protected beneficiarioService: BeneficiarioService,
    protected conveniadoService: ConveniadoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conta }) => {
      this.updateForm(conta);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const conta = this.createFromForm();
    if (conta.id !== undefined) {
      this.subscribeToSaveResponse(this.contaService.update(conta));
    } else {
      this.subscribeToSaveResponse(this.contaService.create(conta));
    }
  }

  trackBeneficiarioById(index: number, item: IBeneficiario): number {
    return item.id!;
  }

  trackConveniadoById(index: number, item: IConveniado): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConta>>): void {
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

  protected updateForm(conta: IConta): void {
    this.editForm.patchValue({
      id: conta.id,
      competencia: conta.competencia,
      status: conta.status,
      beneficiario: conta.beneficiario,
      conveniado: conta.conveniado,
    });

    this.beneficiariosCollection = this.beneficiarioService.addBeneficiarioToCollectionIfMissing(
      this.beneficiariosCollection,
      conta.beneficiario
    );
    this.conveniadosCollection = this.conveniadoService.addConveniadoToCollectionIfMissing(this.conveniadosCollection, conta.conveniado);
  }

  protected loadRelationshipsOptions(): void {
    this.beneficiarioService
      .query({ filter: 'conta-is-null' })
      .pipe(map((res: HttpResponse<IBeneficiario[]>) => res.body ?? []))
      .pipe(
        map((beneficiarios: IBeneficiario[]) =>
          this.beneficiarioService.addBeneficiarioToCollectionIfMissing(beneficiarios, this.editForm.get('beneficiario')!.value)
        )
      )
      .subscribe((beneficiarios: IBeneficiario[]) => (this.beneficiariosCollection = beneficiarios));

    this.conveniadoService
      .query({ filter: 'conta-is-null' })
      .pipe(map((res: HttpResponse<IConveniado[]>) => res.body ?? []))
      .pipe(
        map((conveniados: IConveniado[]) =>
          this.conveniadoService.addConveniadoToCollectionIfMissing(conveniados, this.editForm.get('conveniado')!.value)
        )
      )
      .subscribe((conveniados: IConveniado[]) => (this.conveniadosCollection = conveniados));
  }

  protected createFromForm(): IConta {
    return {
      ...new Conta(),
      id: this.editForm.get(['id'])!.value,
      competencia: this.editForm.get(['competencia'])!.value,
      status: this.editForm.get(['status'])!.value,
      beneficiario: this.editForm.get(['beneficiario'])!.value,
      conveniado: this.editForm.get(['conveniado'])!.value,
    };
  }
}
