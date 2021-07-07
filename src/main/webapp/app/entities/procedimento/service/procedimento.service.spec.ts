import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProcedimento, Procedimento } from '../procedimento.model';

import { ProcedimentoService } from './procedimento.service';

describe('Service Tests', () => {
  describe('Procedimento Service', () => {
    let service: ProcedimentoService;
    let httpMock: HttpTestingController;
    let elemDefault: IProcedimento;
    let expectedResult: IProcedimento | IProcedimento[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProcedimentoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        descricao: 'AAAAAAA',
        quantidade: 0,
        valorInformado: 0,
        valorPago: 0,
        glosa: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Procedimento', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Procedimento()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Procedimento', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            descricao: 'BBBBBB',
            quantidade: 1,
            valorInformado: 1,
            valorPago: 1,
            glosa: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Procedimento', () => {
        const patchObject = Object.assign(
          {
            descricao: 'BBBBBB',
            quantidade: 1,
          },
          new Procedimento()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Procedimento', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            descricao: 'BBBBBB',
            quantidade: 1,
            valorInformado: 1,
            valorPago: 1,
            glosa: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Procedimento', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProcedimentoToCollectionIfMissing', () => {
        it('should add a Procedimento to an empty array', () => {
          const procedimento: IProcedimento = { id: 123 };
          expectedResult = service.addProcedimentoToCollectionIfMissing([], procedimento);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(procedimento);
        });

        it('should not add a Procedimento to an array that contains it', () => {
          const procedimento: IProcedimento = { id: 123 };
          const procedimentoCollection: IProcedimento[] = [
            {
              ...procedimento,
            },
            { id: 456 },
          ];
          expectedResult = service.addProcedimentoToCollectionIfMissing(procedimentoCollection, procedimento);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Procedimento to an array that doesn't contain it", () => {
          const procedimento: IProcedimento = { id: 123 };
          const procedimentoCollection: IProcedimento[] = [{ id: 456 }];
          expectedResult = service.addProcedimentoToCollectionIfMissing(procedimentoCollection, procedimento);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(procedimento);
        });

        it('should add only unique Procedimento to an array', () => {
          const procedimentoArray: IProcedimento[] = [{ id: 123 }, { id: 456 }, { id: 27697 }];
          const procedimentoCollection: IProcedimento[] = [{ id: 123 }];
          expectedResult = service.addProcedimentoToCollectionIfMissing(procedimentoCollection, ...procedimentoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const procedimento: IProcedimento = { id: 123 };
          const procedimento2: IProcedimento = { id: 456 };
          expectedResult = service.addProcedimentoToCollectionIfMissing([], procedimento, procedimento2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(procedimento);
          expect(expectedResult).toContain(procedimento2);
        });

        it('should accept null and undefined values', () => {
          const procedimento: IProcedimento = { id: 123 };
          expectedResult = service.addProcedimentoToCollectionIfMissing([], null, procedimento, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(procedimento);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
