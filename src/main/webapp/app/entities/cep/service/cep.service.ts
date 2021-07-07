import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICep, getCepIdentifier } from '../cep.model';

export type EntityResponseType = HttpResponse<ICep>;
export type EntityArrayResponseType = HttpResponse<ICep[]>;

@Injectable({ providedIn: 'root' })
export class CepService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/ceps');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(cep: ICep): Observable<EntityResponseType> {
    return this.http.post<ICep>(this.resourceUrl, cep, { observe: 'response' });
  }

  update(cep: ICep): Observable<EntityResponseType> {
    return this.http.put<ICep>(`${this.resourceUrl}/${getCepIdentifier(cep) as number}`, cep, { observe: 'response' });
  }

  partialUpdate(cep: ICep): Observable<EntityResponseType> {
    return this.http.patch<ICep>(`${this.resourceUrl}/${getCepIdentifier(cep) as number}`, cep, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICep>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICep[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCepToCollectionIfMissing(cepCollection: ICep[], ...cepsToCheck: (ICep | null | undefined)[]): ICep[] {
    const ceps: ICep[] = cepsToCheck.filter(isPresent);
    if (ceps.length > 0) {
      const cepCollectionIdentifiers = cepCollection.map(cepItem => getCepIdentifier(cepItem)!);
      const cepsToAdd = ceps.filter(cepItem => {
        const cepIdentifier = getCepIdentifier(cepItem);
        if (cepIdentifier == null || cepCollectionIdentifiers.includes(cepIdentifier)) {
          return false;
        }
        cepCollectionIdentifiers.push(cepIdentifier);
        return true;
      });
      return [...cepsToAdd, ...cepCollection];
    }
    return cepCollection;
  }
}
