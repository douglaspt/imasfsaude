jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PagamentoService } from '../service/pagamento.service';
import { IPagamento, Pagamento } from '../pagamento.model';
import { IConta } from 'app/entities/conta/conta.model';
import { ContaService } from 'app/entities/conta/service/conta.service';

import { PagamentoUpdateComponent } from './pagamento-update.component';

describe('Component Tests', () => {
  describe('Pagamento Management Update Component', () => {
    let comp: PagamentoUpdateComponent;
    let fixture: ComponentFixture<PagamentoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let pagamentoService: PagamentoService;
    let contaService: ContaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PagamentoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PagamentoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PagamentoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      pagamentoService = TestBed.inject(PagamentoService);
      contaService = TestBed.inject(ContaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call conta query and add missing value', () => {
        const pagamento: IPagamento = { id: 456 };
        const conta: IConta = { id: 68654 };
        pagamento.conta = conta;

        const contaCollection: IConta[] = [{ id: 12541 }];
        spyOn(contaService, 'query').and.returnValue(of(new HttpResponse({ body: contaCollection })));
        const expectedCollection: IConta[] = [conta, ...contaCollection];
        spyOn(contaService, 'addContaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ pagamento });
        comp.ngOnInit();

        expect(contaService.query).toHaveBeenCalled();
        expect(contaService.addContaToCollectionIfMissing).toHaveBeenCalledWith(contaCollection, conta);
        expect(comp.contasCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const pagamento: IPagamento = { id: 456 };
        const conta: IConta = { id: 88751 };
        pagamento.conta = conta;

        activatedRoute.data = of({ pagamento });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(pagamento));
        expect(comp.contasCollection).toContain(conta);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pagamento = { id: 123 };
        spyOn(pagamentoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pagamento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pagamento }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(pagamentoService.update).toHaveBeenCalledWith(pagamento);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pagamento = new Pagamento();
        spyOn(pagamentoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pagamento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pagamento }));
        saveSubject.complete();

        // THEN
        expect(pagamentoService.create).toHaveBeenCalledWith(pagamento);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pagamento = { id: 123 };
        spyOn(pagamentoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pagamento });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(pagamentoService.update).toHaveBeenCalledWith(pagamento);
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
