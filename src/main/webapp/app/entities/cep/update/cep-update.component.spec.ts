jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CepService } from '../service/cep.service';
import { ICep, Cep } from '../cep.model';

import { CepUpdateComponent } from './cep-update.component';

describe('Component Tests', () => {
  describe('Cep Management Update Component', () => {
    let comp: CepUpdateComponent;
    let fixture: ComponentFixture<CepUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let cepService: CepService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CepUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CepUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CepUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      cepService = TestBed.inject(CepService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const cep: ICep = { id: 456 };

        activatedRoute.data = of({ cep });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(cep));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cep = { id: 123 };
        spyOn(cepService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cep });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cep }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(cepService.update).toHaveBeenCalledWith(cep);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cep = new Cep();
        spyOn(cepService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cep });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cep }));
        saveSubject.complete();

        // THEN
        expect(cepService.create).toHaveBeenCalledWith(cep);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cep = { id: 123 };
        spyOn(cepService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cep });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(cepService.update).toHaveBeenCalledWith(cep);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
