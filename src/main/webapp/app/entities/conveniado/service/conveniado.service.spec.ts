import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Status } from 'app/entities/enumerations/status.model';
import { IConveniado, Conveniado } from '../conveniado.model';

import { ConveniadoService } from './conveniado.service';

describe('Service Tests', () => {
  describe('Conveniado Service', () => {
    let service: ConveniadoService;
    let httpMock: HttpTestingController;
    let elemDefault: IConveniado;
    let expectedResult: IConveniado | IConveniado[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ConveniadoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
        cnpj: 'AAAAAAA',
        contrato: 'AAAAAAA',
        rg: 'AAAAAAA',
        email: 'AAAAAAA',
        telefone: 'AAAAAAA',
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

      it('should create a Conveniado', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Conveniado()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Conveniado', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            cnpj: 'BBBBBB',
            contrato: 'BBBBBB',
            rg: 'BBBBBB',
            email: 'BBBBBB',
            telefone: 'BBBBBB',
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

      it('should partial update a Conveniado', () => {
        const patchObject = Object.assign(
          {
            nome: 'BBBBBB',
            cnpj: 'BBBBBB',
            contrato: 'BBBBBB',
            rg: 'BBBBBB',
          },
          new Conveniado()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Conveniado', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            cnpj: 'BBBBBB',
            contrato: 'BBBBBB',
            rg: 'BBBBBB',
            email: 'BBBBBB',
            telefone: 'BBBBBB',
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

      it('should delete a Conveniado', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addConveniadoToCollectionIfMissing', () => {
        it('should add a Conveniado to an empty array', () => {
          const conveniado: IConveniado = { id: 123 };
          expectedResult = service.addConveniadoToCollectionIfMissing([], conveniado);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(conveniado);
        });

        it('should not add a Conveniado to an array that contains it', () => {
          const conveniado: IConveniado = { id: 123 };
          const conveniadoCollection: IConveniado[] = [
            {
              ...conveniado,
            },
            { id: 456 },
          ];
          expectedResult = service.addConveniadoToCollectionIfMissing(conveniadoCollection, conveniado);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Conveniado to an array that doesn't contain it", () => {
          const conveniado: IConveniado = { id: 123 };
          const conveniadoCollection: IConveniado[] = [{ id: 456 }];
          expectedResult = service.addConveniadoToCollectionIfMissing(conveniadoCollection, conveniado);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(conveniado);
        });

        it('should add only unique Conveniado to an array', () => {
          const conveniadoArray: IConveniado[] = [{ id: 123 }, { id: 456 }, { id: 72946 }];
          const conveniadoCollection: IConveniado[] = [{ id: 123 }];
          expectedResult = service.addConveniadoToCollectionIfMissing(conveniadoCollection, ...conveniadoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const conveniado: IConveniado = { id: 123 };
          const conveniado2: IConveniado = { id: 456 };
          expectedResult = service.addConveniadoToCollectionIfMissing([], conveniado, conveniado2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(conveniado);
          expect(expectedResult).toContain(conveniado2);
        });

        it('should accept null and undefined values', () => {
          const conveniado: IConveniado = { id: 123 };
          expectedResult = service.addConveniadoToCollectionIfMissing([], null, conveniado, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(conveniado);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
