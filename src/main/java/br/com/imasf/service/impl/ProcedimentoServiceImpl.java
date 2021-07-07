package br.com.imasf.service.impl;

import br.com.imasf.domain.Procedimento;
import br.com.imasf.repository.ProcedimentoRepository;
import br.com.imasf.service.ProcedimentoService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Procedimento}.
 */
@Service
@Transactional
public class ProcedimentoServiceImpl implements ProcedimentoService {

    private final Logger log = LoggerFactory.getLogger(ProcedimentoServiceImpl.class);

    private final ProcedimentoRepository procedimentoRepository;

    public ProcedimentoServiceImpl(ProcedimentoRepository procedimentoRepository) {
        this.procedimentoRepository = procedimentoRepository;
    }

    @Override
    public Procedimento save(Procedimento procedimento) {
        log.debug("Request to save Procedimento : {}", procedimento);
        return procedimentoRepository.save(procedimento);
    }

    @Override
    public Optional<Procedimento> partialUpdate(Procedimento procedimento) {
        log.debug("Request to partially update Procedimento : {}", procedimento);

        return procedimentoRepository
            .findById(procedimento.getId())
            .map(
                existingProcedimento -> {
                    if (procedimento.getDescricao() != null) {
                        existingProcedimento.setDescricao(procedimento.getDescricao());
                    }
                    if (procedimento.getQuantidade() != null) {
                        existingProcedimento.setQuantidade(procedimento.getQuantidade());
                    }
                    if (procedimento.getValorInformado() != null) {
                        existingProcedimento.setValorInformado(procedimento.getValorInformado());
                    }
                    if (procedimento.getValorPago() != null) {
                        existingProcedimento.setValorPago(procedimento.getValorPago());
                    }
                    if (procedimento.getGlosa() != null) {
                        existingProcedimento.setGlosa(procedimento.getGlosa());
                    }

                    return existingProcedimento;
                }
            )
            .map(procedimentoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Procedimento> findAll() {
        log.debug("Request to get all Procedimentos");
        return procedimentoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Procedimento> findOne(Long id) {
        log.debug("Request to get Procedimento : {}", id);
        return procedimentoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Procedimento : {}", id);
        procedimentoRepository.deleteById(id);
    }
}
