import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPagamento, Pagamento } from '../pagamento.model';
import { PagamentoService } from '../service/pagamento.service';

@Injectable({ providedIn: 'root' })
export class PagamentoRoutingResolveService implements Resolve<IPagamento> {
  constructor(protected service: PagamentoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPagamento> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pagamento: HttpResponse<Pagamento>) => {
          if (pagamento.body) {
            return of(pagamento.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Pagamento());
  }
}
