import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { StatusPagamento } from 'app/entities/enumerations/status-pagamento.model';
import { IConta, Conta } from '../conta.model';

import { ContaService } from './conta.service';

describe('Service Tests', () => {
  describe('Conta Service', () => {
    let service: ContaService;
    let httpMock: HttpTestingController;
    let elemDefault: IConta;
    let expectedResult: IConta | IConta[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ContaService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        competencia: currentDate,
        status: StatusPagamento.PENDENTE,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            competencia: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Conta', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            competencia: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            competencia: currentDate,
          },
          returnedFromService
        );

        service.create(new Conta()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Conta', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            competencia: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            competencia: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Conta', () => {
        const patchObject = Object.assign(
          {
            competencia: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
          },
          new Conta()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            competencia: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Conta', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            competencia: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            competencia: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Conta', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addContaToCollectionIfMissing', () => {
        it('should add a Conta to an empty array', () => {
          const conta: IConta = { id: 123 };
          expectedResult = service.addContaToCollectionIfMissing([], conta);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(conta);
        });

        it('should not add a Conta to an array that contains it', () => {
          const conta: IConta = { id: 123 };
          const contaCollection: IConta[] = [
            {
              ...conta,
            },
            { id: 456 },
          ];
          expectedResult = service.addContaToCollectionIfMissing(contaCollection, conta);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Conta to an array that doesn't contain it", () => {
          const conta: IConta = { id: 123 };
          const contaCollection: IConta[] = [{ id: 456 }];
          expectedResult = service.addContaToCollectionIfMissing(contaCollection, conta);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(conta);
        });

        it('should add only unique Conta to an array', () => {
          const contaArray: IConta[] = [{ id: 123 }, { id: 456 }, { id: 34822 }];
          const contaCollection: IConta[] = [{ id: 123 }];
          expectedResult = service.addContaToCollectionIfMissing(contaCollection, ...contaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const conta: IConta = { id: 123 };
          const conta2: IConta = { id: 456 };
          expectedResult = service.addContaToCollectionIfMissing([], conta, conta2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(conta);
          expect(expectedResult).toContain(conta2);
        });

        it('should accept null and undefined values', () => {
          const conta: IConta = { id: 123 };
          expectedResult = service.addContaToCollectionIfMissing([], null, conta, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(conta);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
