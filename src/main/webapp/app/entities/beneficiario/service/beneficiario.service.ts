import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBeneficiario, getBeneficiarioIdentifier } from '../beneficiario.model';

export type EntityResponseType = HttpResponse<IBeneficiario>;
export type EntityArrayResponseType = HttpResponse<IBeneficiario[]>;

@Injectable({ providedIn: 'root' })
export class BeneficiarioService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/beneficiarios');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(beneficiario: IBeneficiario): Observable<EntityResponseType> {
    return this.http.post<IBeneficiario>(this.resourceUrl, beneficiario, { observe: 'response' });
  }

  update(beneficiario: IBeneficiario): Observable<EntityResponseType> {
    return this.http.put<IBeneficiario>(`${this.resourceUrl}/${getBeneficiarioIdentifier(beneficiario) as number}`, beneficiario, {
      observe: 'response',
    });
  }

  partialUpdate(beneficiario: IBeneficiario): Observable<EntityResponseType> {
    return this.http.patch<IBeneficiario>(`${this.resourceUrl}/${getBeneficiarioIdentifier(beneficiario) as number}`, beneficiario, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBeneficiario>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBeneficiario[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBeneficiarioToCollectionIfMissing(
    beneficiarioCollection: IBeneficiario[],
    ...beneficiariosToCheck: (IBeneficiario | null | undefined)[]
  ): IBeneficiario[] {
    const beneficiarios: IBeneficiario[] = beneficiariosToCheck.filter(isPresent);
    if (beneficiarios.length > 0) {
      const beneficiarioCollectionIdentifiers = beneficiarioCollection.map(
        beneficiarioItem => getBeneficiarioIdentifier(beneficiarioItem)!
      );
      const beneficiariosToAdd = beneficiarios.filter(beneficiarioItem => {
        const beneficiarioIdentifier = getBeneficiarioIdentifier(beneficiarioItem);
        if (beneficiarioIdentifier == null || beneficiarioCollectionIdentifiers.includes(beneficiarioIdentifier)) {
          return false;
        }
        beneficiarioCollectionIdentifiers.push(beneficiarioIdentifier);
        return true;
      });
      return [...beneficiariosToAdd, ...beneficiarioCollection];
    }
    return beneficiarioCollection;
  }
}
