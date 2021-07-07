import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CepDetailComponent } from './cep-detail.component';

describe('Component Tests', () => {
  describe('Cep Management Detail Component', () => {
    let comp: CepDetailComponent;
    let fixture: ComponentFixture<CepDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CepDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ cep: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CepDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CepDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load cep on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.cep).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
