import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPlano, Plano } from '../plano.model';

import { PlanoService } from './plano.service';

describe('Service Tests', () => {
  describe('Plano Service', () => {
    let service: PlanoService;
    let httpMock: HttpTestingController;
    let elemDefault: IPlano;
    let expectedResult: IPlano | IPlano[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PlanoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
        valor: 0,
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

      it('should create a Plano', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Plano()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Plano', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            valor: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Plano', () => {
        const patchObject = Object.assign(
          {
            nome: 'BBBBBB',
          },
          new Plano()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Plano', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            valor: 1,
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

      it('should delete a Plano', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPlanoToCollectionIfMissing', () => {
        it('should add a Plano to an empty array', () => {
          const plano: IPlano = { id: 123 };
          expectedResult = service.addPlanoToCollectionIfMissing([], plano);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(plano);
        });

        it('should not add a Plano to an array that contains it', () => {
          const plano: IPlano = { id: 123 };
          const planoCollection: IPlano[] = [
            {
              ...plano,
            },
            { id: 456 },
          ];
          expectedResult = service.addPlanoToCollectionIfMissing(planoCollection, plano);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Plano to an array that doesn't contain it", () => {
          const plano: IPlano = { id: 123 };
          const planoCollection: IPlano[] = [{ id: 456 }];
          expectedResult = service.addPlanoToCollectionIfMissing(planoCollection, plano);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(plano);
        });

        it('should add only unique Plano to an array', () => {
          const planoArray: IPlano[] = [{ id: 123 }, { id: 456 }, { id: 86116 }];
          const planoCollection: IPlano[] = [{ id: 123 }];
          expectedResult = service.addPlanoToCollectionIfMissing(planoCollection, ...planoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const plano: IPlano = { id: 123 };
          const plano2: IPlano = { id: 456 };
          expectedResult = service.addPlanoToCollectionIfMissing([], plano, plano2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(plano);
          expect(expectedResult).toContain(plano2);
        });

        it('should accept null and undefined values', () => {
          const plano: IPlano = { id: 123 };
          expectedResult = service.addPlanoToCollectionIfMissing([], null, plano, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(plano);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
