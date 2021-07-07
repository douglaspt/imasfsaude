import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProcedimento, getProcedimentoIdentifier } from '../procedimento.model';

export type EntityResponseType = HttpResponse<IProcedimento>;
export type EntityArrayResponseType = HttpResponse<IProcedimento[]>;

@Injectable({ providedIn: 'root' })
export class ProcedimentoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/procedimentos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(procedimento: IProcedimento): Observable<EntityResponseType> {
    return this.http.post<IProcedimento>(this.resourceUrl, procedimento, { observe: 'response' });
  }

  update(procedimento: IProcedimento): Observable<EntityResponseType> {
    return this.http.put<IProcedimento>(`${this.resourceUrl}/${getProcedimentoIdentifier(procedimento) as number}`, procedimento, {
      observe: 'response',
    });
  }

  partialUpdate(procedimento: IProcedimento): Observable<EntityResponseType> {
    return this.http.patch<IProcedimento>(`${this.resourceUrl}/${getProcedimentoIdentifier(procedimento) as number}`, procedimento, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProcedimento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProcedimento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProcedimentoToCollectionIfMissing(
    procedimentoCollection: IProcedimento[],
    ...procedimentosToCheck: (IProcedimento | null | undefined)[]
  ): IProcedimento[] {
    const procedimentos: IProcedimento[] = procedimentosToCheck.filter(isPresent);
    if (procedimentos.length > 0) {
      const procedimentoCollectionIdentifiers = procedimentoCollection.map(
        procedimentoItem => getProcedimentoIdentifier(procedimentoItem)!
      );
      const procedimentosToAdd = procedimentos.filter(procedimentoItem => {
        const procedimentoIdentifier = getProcedimentoIdentifier(procedimentoItem);
        if (procedimentoIdentifier == null || procedimentoCollectionIdentifiers.includes(procedimentoIdentifier)) {
          return false;
        }
        procedimentoCollectionIdentifiers.push(procedimentoIdentifier);
        return true;
      });
      return [...procedimentosToAdd, ...procedimentoCollection];
    }
    return procedimentoCollection;
  }
}
