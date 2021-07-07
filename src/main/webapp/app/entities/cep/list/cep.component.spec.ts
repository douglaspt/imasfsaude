import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CepService } from '../service/cep.service';

import { CepComponent } from './cep.component';

describe('Component Tests', () => {
  describe('Cep Management Component', () => {
    let comp: CepComponent;
    let fixture: ComponentFixture<CepComponent>;
    let service: CepService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CepComponent],
      })
        .overrideTemplate(CepComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CepComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CepService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.ceps?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
