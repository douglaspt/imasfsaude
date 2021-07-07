import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'conta',
        data: { pageTitle: 'imasfsaudeApp.conta.home.title' },
        loadChildren: () => import('./conta/conta.module').then(m => m.ContaModule),
      },
      {
        path: 'pagamento',
        data: { pageTitle: 'imasfsaudeApp.pagamento.home.title' },
        loadChildren: () => import('./pagamento/pagamento.module').then(m => m.PagamentoModule),
      },
      {
        path: 'procedimento',
        data: { pageTitle: 'imasfsaudeApp.procedimento.home.title' },
        loadChildren: () => import('./procedimento/procedimento.module').then(m => m.ProcedimentoModule),
      },
      {
        path: 'plano',
        data: { pageTitle: 'imasfsaudeApp.plano.home.title' },
        loadChildren: () => import('./plano/plano.module').then(m => m.PlanoModule),
      },
      {
        path: 'cep',
        data: { pageTitle: 'imasfsaudeApp.cep.home.title' },
        loadChildren: () => import('./cep/cep.module').then(m => m.CepModule),
      },
      {
        path: 'beneficiario',
        data: { pageTitle: 'imasfsaudeApp.beneficiario.home.title' },
        loadChildren: () => import('./beneficiario/beneficiario.module').then(m => m.BeneficiarioModule),
      },
      {
        path: 'conveniado',
        data: { pageTitle: 'imasfsaudeApp.conveniado.home.title' },
        loadChildren: () => import('./conveniado/conveniado.module').then(m => m.ConveniadoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
