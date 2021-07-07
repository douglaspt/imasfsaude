import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProcedimentoService } from '../service/procedimento.service';

import { ProcedimentoComponent } from './procedimento.component';

describe('Component Tests', () => {
  describe('Procedimento Management Component', () => {
    let comp: ProcedimentoComponent;
    let fixture: ComponentFixture<ProcedimentoComponent>;
    let service: ProcedimentoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProcedimentoComponent],
      })
        .overrideTemplate(ProcedimentoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProcedimentoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProcedimentoService);

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
      expect(comp.procedimentos?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
