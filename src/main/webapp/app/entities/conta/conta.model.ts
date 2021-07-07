import * as dayjs from 'dayjs';
import { IBeneficiario } from 'app/entities/beneficiario/beneficiario.model';
import { IConveniado } from 'app/entities/conveniado/conveniado.model';
import { IProcedimento } from 'app/entities/procedimento/procedimento.model';
import { StatusPagamento } from 'app/entities/enumerations/status-pagamento.model';

export interface IConta {
  id?: number;
  competencia?: dayjs.Dayjs | null;
  status?: StatusPagamento | null;
  beneficiario?: IBeneficiario | null;
  conveniado?: IConveniado | null;
  procedimentos?: IProcedimento[] | null;
}

export class Conta implements IConta {
  constructor(
    public id?: number,
    public competencia?: dayjs.Dayjs | null,
    public status?: StatusPagamento | null,
    public beneficiario?: IBeneficiario | null,
    public conveniado?: IConveniado | null,
    public procedimentos?: IProcedimento[] | null
  ) {}
}

export function getContaIdentifier(conta: IConta): number | undefined {
  return conta.id;
}
