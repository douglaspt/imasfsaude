jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PlanoService } from '../service/plano.service';
import { IPlano, Plano } from '../plano.model';

import { PlanoUpdateComponent } from './plano-update.component';

describe('Component Tests', () => {
  describe('Plano Management Update Component', () => {
    let comp: PlanoUpdateComponent;
    let fixture: ComponentFixture<PlanoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let planoService: PlanoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PlanoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PlanoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PlanoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      planoService = TestBed.inject(PlanoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const plano: IPlano = { id: 456 };

        activatedRoute.data = of({ plano });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(plano));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const plano = { id: 123 };
        spyOn(planoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ plano });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: plano }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(planoService.update).toHaveBeenCalledWith(plano);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const plano = new Plano();
        spyOn(planoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ plano });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: plano }));
        saveSubject.complete();

        // THEN
        expect(planoService.create).toHaveBeenCalledWith(plano);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const plano = { id: 123 };
        spyOn(planoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ plano });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(planoService.update).toHaveBeenCalledWith(plano);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
