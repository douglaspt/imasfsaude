import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConveniadoDetailComponent } from './conveniado-detail.component';

describe('Component Tests', () => {
  describe('Conveniado Management Detail Component', () => {
    let comp: ConveniadoDetailComponent;
    let fixture: ComponentFixture<ConveniadoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ConveniadoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ conveniado: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ConveniadoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ConveniadoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load conveniado on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.conveniado).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
