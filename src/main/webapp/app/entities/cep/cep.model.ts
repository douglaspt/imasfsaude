export interface ICep {
  id?: number;
  logradouro?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uF?: string | null;
}

export class Cep implements ICep {
  constructor(
    public id?: number,
    public logradouro?: string | null,
    public bairro?: string | null,
    public cidade?: string | null,
    public uF?: string | null
  ) {}
}

export function getCepIdentifier(cep: ICep): number | undefined {
  return cep.id;
}
