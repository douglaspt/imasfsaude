jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BeneficiarioService } from '../service/beneficiario.service';
import { IBeneficiario, Beneficiario } from '../beneficiario.model';
import { ICep } from 'app/entities/cep/cep.model';
import { CepService } from 'app/entities/cep/service/cep.service';
import { IPlano } from 'app/entities/plano/plano.model';
import { PlanoService } from 'app/entities/plano/service/plano.service';

import { BeneficiarioUpdateComponent } from './beneficiario-update.component';

describe('Component Tests', () => {
  describe('Beneficiario Management Update Component', () => {
    let comp: BeneficiarioUpdateComponent;
    let fixture: ComponentFixture<BeneficiarioUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let beneficiarioService: BeneficiarioService;
    let cepService: CepService;
    let planoService: PlanoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BeneficiarioUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BeneficiarioUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BeneficiarioUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      beneficiarioService = TestBed.inject(BeneficiarioService);
      cepService = TestBed.inject(CepService);
      planoService = TestBed.inject(PlanoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call cep query and add missing value', () => {
        const beneficiario: IBeneficiario = { id: 456 };
        const cep: ICep = { id: 68477 };
        beneficiario.cep = cep;

        const cepCollection: ICep[] = [{ id: 31231 }];
        spyOn(cepService, 'query').and.returnValue(of(new HttpResponse({ body: cepCollection })));
        const expectedCollection: ICep[] = [cep, ...cepCollection];
        spyOn(cepService, 'addCepToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ beneficiario });
        comp.ngOnInit();

        expect(cepService.query).toHaveBeenCalled();
        expect(cepService.addCepToCollectionIfMissing).toHaveBeenCalledWith(cepCollection, cep);
        expect(comp.cepsCollection).toEqual(expectedCollection);
      });

      it('Should call plano query and add missing value', () => {
        const beneficiario: IBeneficiario = { id: 456 };
        const plano: IPlano = { id: 7475 };
        beneficiario.plano = plano;

        const planoCollection: IPlano[] = [{ id: 72888 }];
        spyOn(planoService, 'query').and.returnValue(of(new HttpResponse({ body: planoCollection })));
        const expectedCollection: IPlano[] = [plano, ...planoCollection];
        spyOn(planoService, 'addPlanoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ beneficiario });
        comp.ngOnInit();

        expect(planoService.query).toHaveBeenCalled();
        expect(planoService.addPlanoToCollectionIfMissing).toHaveBeenCalledWith(planoCollection, plano);
        expect(comp.planosCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const beneficiario: IBeneficiario = { id: 456 };
        const cep: ICep = { id: 79727 };
        beneficiario.cep = cep;
        const plano: IPlano = { id: 66656 };
        beneficiario.plano = plano;

        activatedRoute.data = of({ beneficiario });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(beneficiario));
        expect(comp.cepsCollection).toContain(cep);
        expect(comp.planosCollection).toContain(plano);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const beneficiario = { id: 123 };
        spyOn(beneficiarioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ beneficiario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: beneficiario }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(beneficiarioService.update).toHaveBeenCalledWith(beneficiario);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const beneficiario = new Beneficiario();
        spyOn(beneficiarioService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ beneficiario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: beneficiario }));
        saveSubject.complete();

        // THEN
        expect(beneficiarioService.create).toHaveBeenCalledWith(beneficiario);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const beneficiario = { id: 123 };
        spyOn(beneficiarioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ beneficiario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(beneficiarioService.update).toHaveBeenCalledWith(beneficiario);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCepById', () => {
        it('Should return tracked Cep primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCepById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPlanoById', () => {
        it('Should return tracked Plano primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPlanoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
