jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ConveniadoService } from '../service/conveniado.service';
import { IConveniado, Conveniado } from '../conveniado.model';
import { ICep } from 'app/entities/cep/cep.model';
import { CepService } from 'app/entities/cep/service/cep.service';

import { ConveniadoUpdateComponent } from './conveniado-update.component';

describe('Component Tests', () => {
  describe('Conveniado Management Update Component', () => {
    let comp: ConveniadoUpdateComponent;
    let fixture: ComponentFixture<ConveniadoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let conveniadoService: ConveniadoService;
    let cepService: CepService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ConveniadoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ConveniadoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConveniadoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      conveniadoService = TestBed.inject(ConveniadoService);
      cepService = TestBed.inject(CepService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call cep query and add missing value', () => {
        const conveniado: IConveniado = { id: 456 };
        const cep: ICep = { id: 22904 };
        conveniado.cep = cep;

        const cepCollection: ICep[] = [{ id: 73619 }];
        spyOn(cepService, 'query').and.returnValue(of(new HttpResponse({ body: cepCollection })));
        const expectedCollection: ICep[] = [cep, ...cepCollection];
        spyOn(cepService, 'addCepToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ conveniado });
        comp.ngOnInit();

        expect(cepService.query).toHaveBeenCalled();
        expect(cepService.addCepToCollectionIfMissing).toHaveBeenCalledWith(cepCollection, cep);
        expect(comp.cepsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const conveniado: IConveniado = { id: 456 };
        const cep: ICep = { id: 35613 };
        conveniado.cep = cep;

        activatedRoute.data = of({ conveniado });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(conveniado));
        expect(comp.cepsCollection).toContain(cep);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const conveniado = { id: 123 };
        spyOn(conveniadoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ conveniado });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: conveniado }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(conveniadoService.update).toHaveBeenCalledWith(conveniado);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const conveniado = new Conveniado();
        spyOn(conveniadoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ conveniado });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: conveniado }));
        saveSubject.complete();

        // THEN
        expect(conveniadoService.create).toHaveBeenCalledWith(conveniado);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const conveniado = { id: 123 };
        spyOn(conveniadoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ conveniado });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(conveniadoService.update).toHaveBeenCalledWith(conveniado);
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
    });
  });
});
