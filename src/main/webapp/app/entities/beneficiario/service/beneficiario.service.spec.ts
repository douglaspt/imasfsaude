import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Status } from 'app/entities/enumerations/status.model';
import { IBeneficiario, Beneficiario } from '../beneficiario.model';

import { BeneficiarioService } from './beneficiario.service';

describe('Service Tests', () => {
  describe('Beneficiario Service', () => {
    let service: BeneficiarioService;
    let httpMock: HttpTestingController;
    let elemDefault: IBeneficiario;
    let expectedResult: IBeneficiario | IBeneficiario[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BeneficiarioService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
        cpf: 'AAAAAAA',
        rg: 'AAAAAAA',
        email: 'AAAAAAA',
        status: Status.ATIVO,
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

      it('should create a Beneficiario', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Beneficiario()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Beneficiario', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            cpf: 'BBBBBB',
            rg: 'BBBBBB',
            email: 'BBBBBB',
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Beneficiario', () => {
        const patchObject = Object.assign(
          {
            cpf: 'BBBBBB',
            status: 'BBBBBB',
          },
          new Beneficiario()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Beneficiario', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            cpf: 'BBBBBB',
            rg: 'BBBBBB',
            email: 'BBBBBB',
            status: 'BBBBBB',
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

      it('should delete a Beneficiario', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBeneficiarioToCollectionIfMissing', () => {
        it('should add a Beneficiario to an empty array', () => {
          const beneficiario: IBeneficiario = { id: 123 };
          expectedResult = service.addBeneficiarioToCollectionIfMissing([], beneficiario);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(beneficiario);
        });

        it('should not add a Beneficiario to an array that contains it', () => {
          const beneficiario: IBeneficiario = { id: 123 };
          const beneficiarioCollection: IBeneficiario[] = [
            {
              ...beneficiario,
            },
            { id: 456 },
          ];
          expectedResult = service.addBeneficiarioToCollectionIfMissing(beneficiarioCollection, beneficiario);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Beneficiario to an array that doesn't contain it", () => {
          const beneficiario: IBeneficiario = { id: 123 };
          const beneficiarioCollection: IBeneficiario[] = [{ id: 456 }];
          expectedResult = service.addBeneficiarioToCollectionIfMissing(beneficiarioCollection, beneficiario);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(beneficiario);
        });

        it('should add only unique Beneficiario to an array', () => {
          const beneficiarioArray: IBeneficiario[] = [{ id: 123 }, { id: 456 }, { id: 76715 }];
          const beneficiarioCollection: IBeneficiario[] = [{ id: 123 }];
          expectedResult = service.addBeneficiarioToCollectionIfMissing(beneficiarioCollection, ...beneficiarioArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const beneficiario: IBeneficiario = { id: 123 };
          const beneficiario2: IBeneficiario = { id: 456 };
          expectedResult = service.addBeneficiarioToCollectionIfMissing([], beneficiario, beneficiario2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(beneficiario);
          expect(expectedResult).toContain(beneficiario2);
        });

        it('should accept null and undefined values', () => {
          const beneficiario: IBeneficiario = { id: 123 };
          expectedResult = service.addBeneficiarioToCollectionIfMissing([], null, beneficiario, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(beneficiario);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
