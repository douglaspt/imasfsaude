jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ContaService } from '../service/conta.service';
import { IConta, Conta } from '../conta.model';
import { IBeneficiario } from 'app/entities/beneficiario/beneficiario.model';
import { BeneficiarioService } from 'app/entities/beneficiario/service/beneficiario.service';
import { IConveniado } from 'app/entities/conveniado/conveniado.model';
import { ConveniadoService } from 'app/entities/conveniado/service/conveniado.service';

import { ContaUpdateComponent } from './conta-update.component';

describe('Component Tests', () => {
  describe('Conta Management Update Component', () => {
    let comp: ContaUpdateComponent;
    let fixture: ComponentFixture<ContaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let contaService: ContaService;
    let beneficiarioService: BeneficiarioService;
    let conveniadoService: ConveniadoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ContaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ContaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ContaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      contaService = TestBed.inject(ContaService);
      beneficiarioService = TestBed.inject(BeneficiarioService);
      conveniadoService = TestBed.inject(ConveniadoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call beneficiario query and add missing value', () => {
        const conta: IConta = { id: 456 };
        const beneficiario: IBeneficiario = { id: 30022 };
        conta.beneficiario = beneficiario;

        const beneficiarioCollection: IBeneficiario[] = [{ id: 32790 }];
        spyOn(beneficiarioService, 'query').and.returnValue(of(new HttpResponse({ body: beneficiarioCollection })));
        const expectedCollection: IBeneficiario[] = [beneficiario, ...beneficiarioCollection];
        spyOn(beneficiarioService, 'addBeneficiarioToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ conta });
        comp.ngOnInit();

        expect(beneficiarioService.query).toHaveBeenCalled();
        expect(beneficiarioService.addBeneficiarioToCollectionIfMissing).toHaveBeenCalledWith(beneficiarioCollection, beneficiario);
        expect(comp.beneficiariosCollection).toEqual(expectedCollection);
      });

      it('Should call conveniado query and add missing value', () => {
        const conta: IConta = { id: 456 };
        const conveniado: IConveniado = { id: 26272 };
        conta.conveniado = conveniado;

        const conveniadoCollection: IConveniado[] = [{ id: 46582 }];
        spyOn(conveniadoService, 'query').and.returnValue(of(new HttpResponse({ body: conveniadoCollection })));
        const expectedCollection: IConveniado[] = [conveniado, ...conveniadoCollection];
        spyOn(conveniadoService, 'addConveniadoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ conta });
        comp.ngOnInit();

        expect(conveniadoService.query).toHaveBeenCalled();
        expect(conveniadoService.addConveniadoToCollectionIfMissing).toHaveBeenCalledWith(conveniadoCollection, conveniado);
        expect(comp.conveniadosCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const conta: IConta = { id: 456 };
        const beneficiario: IBeneficiario = { id: 39342 };
        conta.beneficiario = beneficiario;
        const conveniado: IConveniado = { id: 45109 };
        conta.conveniado = conveniado;

        activatedRoute.data = of({ conta });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(conta));
        expect(comp.beneficiariosCollection).toContain(beneficiario);
        expect(comp.conveniadosCollection).toContain(conveniado);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const conta = { id: 123 };
        spyOn(contaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ conta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: conta }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(contaService.update).toHaveBeenCalledWith(conta);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const conta = new Conta();
        spyOn(contaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ conta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: conta }));
        saveSubject.complete();

        // THEN
        expect(contaService.create).toHaveBeenCalledWith(conta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const conta = { id: 123 };
        spyOn(contaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ conta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(contaService.update).toHaveBeenCalledWith(conta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBeneficiarioById', () => {
        it('Should return tracked Beneficiario primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBeneficiarioById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackConveniadoById', () => {
        it('Should return tracked Conveniado primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackConveniadoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
