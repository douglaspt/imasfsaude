jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPlano, Plano } from '../plano.model';
import { PlanoService } from '../service/plano.service';

import { PlanoRoutingResolveService } from './plano-routing-resolve.service';

describe('Service Tests', () => {
  describe('Plano routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PlanoRoutingResolveService;
    let service: PlanoService;
    let resultPlano: IPlano | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PlanoRoutingResolveService);
      service = TestBed.inject(PlanoService);
      resultPlano = undefined;
    });

    describe('resolve', () => {
      it('should return IPlano returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPlano = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPlano).toEqual({ id: 123 });
      });

      it('should return new IPlano if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPlano = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPlano).toEqual(new Plano());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPlano = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPlano).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
