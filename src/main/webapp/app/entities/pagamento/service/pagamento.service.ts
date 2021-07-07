import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPagamento, getPagamentoIdentifier } from '../pagamento.model';

export type EntityResponseType = HttpResponse<IPagamento>;
export type EntityArrayResponseType = HttpResponse<IPagamento[]>;

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/pagamentos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(pagamento: IPagamento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pagamento);
    return this.http
      .post<IPagamento>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(pagamento: IPagamento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pagamento);
    return this.http
      .put<IPagamento>(`${this.resourceUrl}/${getPagamentoIdentifier(pagamento) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(pagamento: IPagamento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pagamento);
    return this.http
      .patch<IPagamento>(`${this.resourceUrl}/${getPagamentoIdentifier(pagamento) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPagamento>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPagamento[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPagamentoToCollectionIfMissing(
    pagamentoCollection: IPagamento[],
    ...pagamentosToCheck: (IPagamento | null | undefined)[]
  ): IPagamento[] {
    const pagamentos: IPagamento[] = pagamentosToCheck.filter(isPresent);
    if (pagamentos.length > 0) {
      const pagamentoCollectionIdentifiers = pagamentoCollection.map(pagamentoItem => getPagamentoIdentifier(pagamentoItem)!);
      const pagamentosToAdd = pagamentos.filter(pagamentoItem => {
        const pagamentoIdentifier = getPagamentoIdentifier(pagamentoItem);
        if (pagamentoIdentifier == null || pagamentoCollectionIdentifiers.includes(pagamentoIdentifier)) {
          return false;
        }
        pagamentoCollectionIdentifiers.push(pagamentoIdentifier);
        return true;
      });
      return [...pagamentosToAdd, ...pagamentoCollection];
    }
    return pagamentoCollection;
  }

  protected convertDateFromClient(pagamento: IPagamento): IPagamento {
    return Object.assign({}, pagamento, {
      emissao: pagamento.emissao?.isValid() ? pagamento.emissao.format(DATE_FORMAT) : undefined,
      vencimento: pagamento.vencimento?.isValid() ? pagamento.vencimento.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.emissao = res.body.emissao ? dayjs(res.body.emissao) : undefined;
      res.body.vencimento = res.body.vencimento ? dayjs(res.body.vencimento) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((pagamento: IPagamento) => {
        pagamento.emissao = pagamento.emissao ? dayjs(pagamento.emissao) : undefined;
        pagamento.vencimento = pagamento.vencimento ? dayjs(pagamento.vencimento) : undefined;
      });
    }
    return res;
  }
}
