import * as dayjs from 'dayjs';
import { IConta } from 'app/entities/conta/conta.model';
import { StatusPagamento } from 'app/entities/enumerations/status-pagamento.model';

export interface IPagamento {
  id?: number;
  descricao?: string | null;
  emissao?: dayjs.Dayjs | null;
  vencimento?: dayjs.Dayjs | null;
  valor?: number | null;
  valorDesconto?: number | null;
  valorAcrescimo?: number | null;
  valorPago?: number | null;
  status?: StatusPagamento | null;
  conta?: IConta | null;
}

export class Pagamento implements IPagamento {
  constructor(
    public id?: number,
    public descricao?: string | null,
    public emissao?: dayjs.Dayjs | null,
    public vencimento?: dayjs.Dayjs | null,
    public valor?: number | null,
    public valorDesconto?: number | null,
    public valorAcrescimo?: number | null,
    public valorPago?: number | null,
    public status?: StatusPagamento | null,
    public conta?: IConta | null
  ) {}
}

export function getPagamentoIdentifier(pagamento: IPagamento): number | undefined {
  return pagamento.id;
}
