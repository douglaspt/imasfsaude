import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConveniado, Conveniado } from '../conveniado.model';
import { ConveniadoService } from '../service/conveniado.service';

@Injectable({ providedIn: 'root' })
export class ConveniadoRoutingResolveService implements Resolve<IConveniado> {
  constructor(protected service: ConveniadoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConveniado> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((conveniado: HttpResponse<Conveniado>) => {
          if (conveniado.body) {
            return of(conveniado.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Conveniado());
  }
}
