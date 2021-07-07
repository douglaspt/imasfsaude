import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PlanoDetailComponent } from './plano-detail.component';

describe('Component Tests', () => {
  describe('Plano Management Detail Component', () => {
    let comp: PlanoDetailComponent;
    let fixture: ComponentFixture<PlanoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PlanoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ plano: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PlanoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PlanoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load plano on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.plano).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
