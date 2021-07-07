jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPagamento, Pagamento } from '../pagamento.model';
import { PagamentoService } from '../service/pagamento.service';

import { PagamentoRoutingResolveService } from './pagamento-routing-resolve.service';

describe('Service Tests', () => {
  describe('Pagamento routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PagamentoRoutingResolveService;
    let service: PagamentoService;
    let resultPagamento: IPagamento | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PagamentoRoutingResolveService);
      service = TestBed.inject(PagamentoService);
      resultPagamento = undefined;
    });

    describe('resolve', () => {
      it('should return IPagamento returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPagamento = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPagamento).toEqual({ id: 123 });
      });

      it('should return new IPagamento if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPagamento = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPagamento).toEqual(new Pagamento());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPagamento = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPagamento).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
