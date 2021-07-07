import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConveniado, getConveniadoIdentifier } from '../conveniado.model';

export type EntityResponseType = HttpResponse<IConveniado>;
export type EntityArrayResponseType = HttpResponse<IConveniado[]>;

@Injectable({ providedIn: 'root' })
export class ConveniadoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/conveniados');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(conveniado: IConveniado): Observable<EntityResponseType> {
    return this.http.post<IConveniado>(this.resourceUrl, conveniado, { observe: 'response' });
  }

  update(conveniado: IConveniado): Observable<EntityResponseType> {
    return this.http.put<IConveniado>(`${this.resourceUrl}/${getConveniadoIdentifier(conveniado) as number}`, conveniado, {
      observe: 'response',
    });
  }

  partialUpdate(conveniado: IConveniado): Observable<EntityResponseType> {
    return this.http.patch<IConveniado>(`${this.resourceUrl}/${getConveniadoIdentifier(conveniado) as number}`, conveniado, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IConveniado>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IConveniado[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConveniadoToCollectionIfMissing(
    conveniadoCollection: IConveniado[],
    ...conveniadosToCheck: (IConveniado | null | undefined)[]
  ): IConveniado[] {
    const conveniados: IConveniado[] = conveniadosToCheck.filter(isPresent);
    if (conveniados.length > 0) {
      const conveniadoCollectionIdentifiers = conveniadoCollection.map(conveniadoItem => getConveniadoIdentifier(conveniadoItem)!);
      const conveniadosToAdd = conveniados.filter(conveniadoItem => {
        const conveniadoIdentifier = getConveniadoIdentifier(conveniadoItem);
        if (conveniadoIdentifier == null || conveniadoCollectionIdentifiers.includes(conveniadoIdentifier)) {
          return false;
        }
        conveniadoCollectionIdentifiers.push(conveniadoIdentifier);
        return true;
      });
      return [...conveniadosToAdd, ...conveniadoCollection];
    }
    return conveniadoCollection;
  }
}
