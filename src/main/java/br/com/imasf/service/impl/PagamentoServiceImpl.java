package br.com.imasf.service.impl;

import br.com.imasf.domain.Pagamento;
import br.com.imasf.repository.PagamentoRepository;
import br.com.imasf.service.PagamentoService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Pagamento}.
 */
@Service
@Transactional
public class PagamentoServiceImpl implements PagamentoService {

    private final Logger log = LoggerFactory.getLogger(PagamentoServiceImpl.class);

    private final PagamentoRepository pagamentoRepository;

    public PagamentoServiceImpl(PagamentoRepository pagamentoRepository) {
        this.pagamentoRepository = pagamentoRepository;
    }

    @Override
    public Pagamento save(Pagamento pagamento) {
        log.debug("Request to save Pagamento : {}", pagamento);
        return pagamentoRepository.save(pagamento);
    }

    @Override
    public Optional<Pagamento> partialUpdate(Pagamento pagamento) {
        log.debug("Request to partially update Pagamento : {}", pagamento);

        return pagamentoRepository
            .findById(pagamento.getId())
            .map(
                existingPagamento -> {
                    if (pagamento.getDescricao() != null) {
                        existingPagamento.setDescricao(pagamento.getDescricao());
                    }
                    if (pagamento.getEmissao() != null) {
                        existingPagamento.setEmissao(pagamento.getEmissao());
                    }
                    if (pagamento.getVencimento() != null) {
                        existingPagamento.setVencimento(pagamento.getVencimento());
                    }
                    if (pagamento.getValor() != null) {
                        existingPagamento.setValor(pagamento.getValor());
                    }
                    if (pagamento.getValorDesconto() != null) {
                        existingPagamento.setValorDesconto(pagamento.getValorDesconto());
                    }
                    if (pagamento.getValorAcrescimo() != null) {
                        existingPagamento.setValorAcrescimo(pagamento.getValorAcrescimo());
                    }
                    if (pagamento.getValorPago() != null) {
                        existingPagamento.setValorPago(pagamento.getValorPago());
                    }
                    if (pagamento.getStatus() != null) {
                        existingPagamento.setStatus(pagamento.getStatus());
                    }

                    return existingPagamento;
                }
            )
            .map(pagamentoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Pagamento> findAll(Pageable pageable) {
        log.debug("Request to get all Pagamentos");
        return pagamentoRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pagamento> findOne(Long id) {
        log.debug("Request to get Pagamento : {}", id);
        return pagamentoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Pagamento : {}", id);
        pagamentoRepository.deleteById(id);
    }
}
