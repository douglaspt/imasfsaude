import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlano, getPlanoIdentifier } from '../plano.model';

export type EntityResponseType = HttpResponse<IPlano>;
export type EntityArrayResponseType = HttpResponse<IPlano[]>;

@Injectable({ providedIn: 'root' })
export class PlanoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/planos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(plano: IPlano): Observable<EntityResponseType> {
    return this.http.post<IPlano>(this.resourceUrl, plano, { observe: 'response' });
  }

  update(plano: IPlano): Observable<EntityResponseType> {
    return this.http.put<IPlano>(`${this.resourceUrl}/${getPlanoIdentifier(plano) as number}`, plano, { observe: 'response' });
  }

  partialUpdate(plano: IPlano): Observable<EntityResponseType> {
    return this.http.patch<IPlano>(`${this.resourceUrl}/${getPlanoIdentifier(plano) as number}`, plano, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPlano>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPlano[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPlanoToCollectionIfMissing(planoCollection: IPlano[], ...planosToCheck: (IPlano | null | undefined)[]): IPlano[] {
    const planos: IPlano[] = planosToCheck.filter(isPresent);
    if (planos.length > 0) {
      const planoCollectionIdentifiers = planoCollection.map(planoItem => getPlanoIdentifier(planoItem)!);
      const planosToAdd = planos.filter(planoItem => {
        const planoIdentifier = getPlanoIdentifier(planoItem);
        if (planoIdentifier == null || planoCollectionIdentifiers.includes(planoIdentifier)) {
          return false;
        }
        planoCollectionIdentifiers.push(planoIdentifier);
        return true;
      });
      return [...planosToAdd, ...planoCollection];
    }
    return planoCollection;
  }
}
