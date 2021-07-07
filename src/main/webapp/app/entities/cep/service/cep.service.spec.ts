import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICep, Cep } from '../cep.model';

import { CepService } from './cep.service';

describe('Service Tests', () => {
  describe('Cep Service', () => {
    let service: CepService;
    let httpMock: HttpTestingController;
    let elemDefault: ICep;
    let expectedResult: ICep | ICep[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CepService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        logradouro: 'AAAAAAA',
        bairro: 'AAAAAAA',
        cidade: 'AAAAAAA',
        uF: 'AAAAAAA',
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

      it('should create a Cep', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Cep()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Cep', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            logradouro: 'BBBBBB',
            bairro: 'BBBBBB',
            cidade: 'BBBBBB',
            uF: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Cep', () => {
        const patchObject = Object.assign(
          {
            bairro: 'BBBBBB',
            cidade: 'BBBBBB',
            uF: 'BBBBBB',
          },
          new Cep()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Cep', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            logradouro: 'BBBBBB',
            bairro: 'BBBBBB',
            cidade: 'BBBBBB',
            uF: 'BBBBBB',
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

      it('should delete a Cep', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCepToCollectionIfMissing', () => {
        it('should add a Cep to an empty array', () => {
          const cep: ICep = { id: 123 };
          expectedResult = service.addCepToCollectionIfMissing([], cep);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cep);
        });

        it('should not add a Cep to an array that contains it', () => {
          const cep: ICep = { id: 123 };
          const cepCollection: ICep[] = [
            {
              ...cep,
            },
            { id: 456 },
          ];
          expectedResult = service.addCepToCollectionIfMissing(cepCollection, cep);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Cep to an array that doesn't contain it", () => {
          const cep: ICep = { id: 123 };
          const cepCollection: ICep[] = [{ id: 456 }];
          expectedResult = service.addCepToCollectionIfMissing(cepCollection, cep);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cep);
        });

        it('should add only unique Cep to an array', () => {
          const cepArray: ICep[] = [{ id: 123 }, { id: 456 }, { id: 6184 }];
          const cepCollection: ICep[] = [{ id: 123 }];
          expectedResult = service.addCepToCollectionIfMissing(cepCollection, ...cepArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const cep: ICep = { id: 123 };
          const cep2: ICep = { id: 456 };
          expectedResult = service.addCepToCollectionIfMissing([], cep, cep2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(cep);
          expect(expectedResult).toContain(cep2);
        });

        it('should accept null and undefined values', () => {
          const cep: ICep = { id: 123 };
          expectedResult = service.addCepToCollectionIfMissing([], null, cep, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(cep);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
