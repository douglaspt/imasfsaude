import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICep, Cep } from '../cep.model';
import { CepService } from '../service/cep.service';

@Injectable({ providedIn: 'root' })
export class CepRoutingResolveService implements Resolve<ICep> {
  constructor(protected service: CepService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICep> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cep: HttpResponse<Cep>) => {
          if (cep.body) {
            return of(cep.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Cep());
  }
}
