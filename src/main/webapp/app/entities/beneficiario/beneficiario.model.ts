import { ICep } from 'app/entities/cep/cep.model';
import { IPlano } from 'app/entities/plano/plano.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IBeneficiario {
  id?: number;
  nome?: string | null;
  cpf?: string | null;
  rg?: string | null;
  email?: string | null;
  status?: Status | null;
  cep?: ICep | null;
  plano?: IPlano | null;
}

export class Beneficiario implements IBeneficiario {
  constructor(
    public id?: number,
    public nome?: string | null,
    public cpf?: string | null,
    public rg?: string | null,
    public email?: string | null,
    public status?: Status | null,
    public cep?: ICep | null,
    public plano?: IPlano | null
  ) {}
}

export function getBeneficiarioIdentifier(beneficiario: IBeneficiario): number | undefined {
  return beneficiario.id;
}
