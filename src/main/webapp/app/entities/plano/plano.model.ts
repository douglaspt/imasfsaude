export interface IPlano {
  id?: number;
  nome?: string | null;
  valor?: number | null;
}

export class Plano implements IPlano {
  constructor(public id?: number, public nome?: string | null, public valor?: number | null) {}
}

export function getPlanoIdentifier(plano: IPlano): number | undefined {
  return plano.id;
}
