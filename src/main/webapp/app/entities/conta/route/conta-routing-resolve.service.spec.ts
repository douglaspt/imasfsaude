jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IConta, Conta } from '../conta.model';
import { ContaService } from '../service/conta.service';

import { ContaRoutingResolveService } from './conta-routing-resolve.service';

describe('Service Tests', () => {
  describe('Conta routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ContaRoutingResolveService;
    let service: ContaService;
    let resultConta: IConta | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ContaRoutingResolveService);
      service = TestBed.inject(ContaService);
      resultConta = undefined;
    });

    describe('resolve', () => {
      it('should return IConta returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConta = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultConta).toEqual({ id: 123 });
      });

      it('should return new IConta if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConta = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultConta).toEqual(new Conta());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConta = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultConta).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
