import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BeneficiarioDetailComponent } from './beneficiario-detail.component';

describe('Component Tests', () => {
  describe('Beneficiario Management Detail Component', () => {
    let comp: BeneficiarioDetailComponent;
    let fixture: ComponentFixture<BeneficiarioDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BeneficiarioDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ beneficiario: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BeneficiarioDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BeneficiarioDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load beneficiario on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.beneficiario).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
