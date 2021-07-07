import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPlano, Plano } from '../plano.model';
import { PlanoService } from '../service/plano.service';

@Injectable({ providedIn: 'root' })
export class PlanoRoutingResolveService implements Resolve<IPlano> {
  constructor(protected service: PlanoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPlano> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((plano: HttpResponse<Plano>) => {
          if (plano.body) {
            return of(plano.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Plano());
  }
}
