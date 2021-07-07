jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBeneficiario, Beneficiario } from '../beneficiario.model';
import { BeneficiarioService } from '../service/beneficiario.service';

import { BeneficiarioRoutingResolveService } from './beneficiario-routing-resolve.service';

describe('Service Tests', () => {
  describe('Beneficiario routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BeneficiarioRoutingResolveService;
    let service: BeneficiarioService;
    let resultBeneficiario: IBeneficiario | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BeneficiarioRoutingResolveService);
      service = TestBed.inject(BeneficiarioService);
      resultBeneficiario = undefined;
    });

    describe('resolve', () => {
      it('should return IBeneficiario returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBeneficiario = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBeneficiario).toEqual({ id: 123 });
      });

      it('should return new IBeneficiario if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBeneficiario = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBeneficiario).toEqual(new Beneficiario());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBeneficiario = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBeneficiario).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
