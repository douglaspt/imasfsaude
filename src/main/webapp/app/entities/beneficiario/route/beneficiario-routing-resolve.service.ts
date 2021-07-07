import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBeneficiario, Beneficiario } from '../beneficiario.model';
import { BeneficiarioService } from '../service/beneficiario.service';

@Injectable({ providedIn: 'root' })
export class BeneficiarioRoutingResolveService implements Resolve<IBeneficiario> {
  constructor(protected service: BeneficiarioService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBeneficiario> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((beneficiario: HttpResponse<Beneficiario>) => {
          if (beneficiario.body) {
            return of(beneficiario.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Beneficiario());
  }
}
