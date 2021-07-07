import { ICep } from 'app/entities/cep/cep.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IConveniado {
  id?: number;
  nome?: string | null;
  cnpj?: string | null;
  contrato?: string | null;
  rg?: string | null;
  email?: string | null;
  telefone?: string | null;
  status?: Status | null;
  cep?: ICep | null;
}

export class Conveniado implements IConveniado {
  constructor(
    public id?: number,
    public nome?: string | null,
    public cnpj?: string | null,
    public contrato?: string | null,
    public rg?: string | null,
    public email?: string | null,
    public telefone?: string | null,
    public status?: Status | null,
    public cep?: ICep | null
  ) {}
}

export function getConveniadoIdentifier(conveniado: IConveniado): number | undefined {
  return conveniado.id;
}
