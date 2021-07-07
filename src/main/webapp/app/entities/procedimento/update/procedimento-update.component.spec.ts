jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProcedimentoService } from '../service/procedimento.service';
import { IProcedimento, Procedimento } from '../procedimento.model';
import { IConta } from 'app/entities/conta/conta.model';
import { ContaService } from 'app/entities/conta/service/conta.service';

import { ProcedimentoUpdateComponent } from './procedimento-update.component';

describe('Component Tests', () => {
  describe('Procedimento Management Update Component', () => {
    let comp: ProcedimentoUpdateComponent;
    let fixture: ComponentFixture<ProcedimentoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let procedimentoService: ProcedimentoService;
    let contaService: ContaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProcedimentoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProcedimentoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProcedimentoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      procedimentoService = TestBed.inject(ProcedimentoService);
      contaService = TestBed.inject(ContaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Conta query and add missing value', () => {
        const procedimento: IProcedimento = { id: 456 };
        const conta: IConta = { id: 65046 };
        procedimento.conta = conta;

        const contaCollection: IConta[] = [{ id: 24216 }];
        spyOn(contaService, 'query').and.returnValue(of(new HttpResponse({ body: contaCollection })));
        const additionalContas = [conta];
        const expectedCollection: IConta[] = [...additionalContas, ...contaCollection];
        spyOn(contaService, 'addContaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ procedimento });
        comp.ngOnInit();

        expect(contaService.query).toHaveBeenCalled();
        expect(contaService.addContaToCollectionIfMissing).toHaveBeenCalledWith(contaCollection, ...additionalContas);
        expect(comp.contasSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const procedimento: IProcedimento = { id: 456 };
        const conta: IConta = { id: 32839 };
        procedimento.conta = conta;

        activatedRoute.data = of({ procedimento });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(procedimento));
        expect(comp.contasSharedCollection).toContain(conta);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const procedimento = { id: 123 };
        spyOn(procedimentoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ procedimento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: procedimento }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(procedimentoService.update).toHaveBeenCalledWith(procedimento);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const procedimento = new Procedimento();
        spyOn(procedimentoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ procedimento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: procedimento }));
        saveSubject.complete();

        // THEN
        expect(procedimentoService.create).toHaveBeenCalledWith(procedimento);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const procedimento = { id: 123 };
        spyOn(procedimentoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ procedimento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(procedimentoService.update).toHaveBeenCalledWith(procedimento);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackContaById', () => {
        it('Should return tracked Conta primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackContaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
