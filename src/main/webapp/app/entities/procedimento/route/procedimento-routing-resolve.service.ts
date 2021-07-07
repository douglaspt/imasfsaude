import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProcedimento, Procedimento } from '../procedimento.model';
import { ProcedimentoService } from '../service/procedimento.service';

@Injectable({ providedIn: 'root' })
export class ProcedimentoRoutingResolveService implements Resolve<IProcedimento> {
  constructor(protected service: ProcedimentoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProcedimento> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((procedimento: HttpResponse<Procedimento>) => {
          if (procedimento.body) {
            return of(procedimento.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Procedimento());
  }
}
