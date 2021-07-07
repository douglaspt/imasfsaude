import { IConta } from 'app/entities/conta/conta.model';

export interface IProcedimento {
  id?: number;
  descricao?: string | null;
  quantidade?: number | null;
  valorInformado?: number | null;
  valorPago?: number | null;
  glosa?: number | null;
  conta?: IConta | null;
}

export class Procedimento implements IProcedimento {
  constructor(
    public id?: number,
    public descricao?: string | null,
    public quantidade?: number | null,
    public valorInformado?: number | null,
    public valorPago?: number | null,
    public glosa?: number | null,
    public conta?: IConta | null
  ) {}
}

export function getProcedimentoIdentifier(procedimento: IProcedimento): number | undefined {
  return procedimento.id;
}
