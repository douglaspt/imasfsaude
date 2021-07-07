package br.com.imasf.service.impl;

import br.com.imasf.domain.Conta;
import br.com.imasf.repository.ContaRepository;
import br.com.imasf.service.ContaService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Conta}.
 */
@Service
@Transactional
public class ContaServiceImpl implements ContaService {

    private final Logger log = LoggerFactory.getLogger(ContaServiceImpl.class);

    private final ContaRepository contaRepository;

    public ContaServiceImpl(ContaRepository contaRepository) {
        this.contaRepository = contaRepository;
    }

    @Override
    public Conta save(Conta conta) {
        log.debug("Request to save Conta : {}", conta);
        return contaRepository.save(conta);
    }

    @Override
    public Optional<Conta> partialUpdate(Conta conta) {
        log.debug("Request to partially update Conta : {}", conta);

        return contaRepository
            .findById(conta.getId())
            .map(
                existingConta -> {
                    if (conta.getCompetencia() != null) {
                        existingConta.setCompetencia(conta.getCompetencia());
                    }
                    if (conta.getStatus() != null) {
                        existingConta.setStatus(conta.getStatus());
                    }

                    return existingConta;
                }
            )
            .map(contaRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Conta> findAll(Pageable pageable) {
        log.debug("Request to get all Contas");
        return contaRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Conta> findOne(Long id) {
        log.debug("Request to get Conta : {}", id);
        return contaRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Conta : {}", id);
        contaRepository.deleteById(id);
    }
}
