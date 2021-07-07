import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConta, getContaIdentifier } from '../conta.model';

export type EntityResponseType = HttpResponse<IConta>;
export type EntityArrayResponseType = HttpResponse<IConta[]>;

@Injectable({ providedIn: 'root' })
export class ContaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/contas');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(conta: IConta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conta);
    return this.http
      .post<IConta>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(conta: IConta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conta);
    return this.http
      .put<IConta>(`${this.resourceUrl}/${getContaIdentifier(conta) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(conta: IConta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conta);
    return this.http
      .patch<IConta>(`${this.resourceUrl}/${getContaIdentifier(conta) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IConta>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IConta[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addContaToCollectionIfMissing(contaCollection: IConta[], ...contasToCheck: (IConta | null | undefined)[]): IConta[] {
    const contas: IConta[] = contasToCheck.filter(isPresent);
    if (contas.length > 0) {
      const contaCollectionIdentifiers = contaCollection.map(contaItem => getContaIdentifier(contaItem)!);
      const contasToAdd = contas.filter(contaItem => {
        const contaIdentifier = getContaIdentifier(contaItem);
        if (contaIdentifier == null || contaCollectionIdentifiers.includes(contaIdentifier)) {
          return false;
        }
        contaCollectionIdentifiers.push(contaIdentifier);
        return true;
      });
      return [...contasToAdd, ...contaCollection];
    }
    return contaCollection;
  }

  protected convertDateFromClient(conta: IConta): IConta {
    return Object.assign({}, conta, {
      competencia: conta.competencia?.isValid() ? conta.competencia.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.competencia = res.body.competencia ? dayjs(res.body.competencia) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((conta: IConta) => {
        conta.competencia = conta.competencia ? dayjs(conta.competencia) : undefined;
      });
    }
    return res;
  }
}
