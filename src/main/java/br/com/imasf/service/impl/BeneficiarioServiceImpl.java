package br.com.imasf.service.impl;

import br.com.imasf.domain.Beneficiario;
import br.com.imasf.repository.BeneficiarioRepository;
import br.com.imasf.service.BeneficiarioService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Beneficiario}.
 */
@Service
@Transactional
public class BeneficiarioServiceImpl implements BeneficiarioService {

    private final Logger log = LoggerFactory.getLogger(BeneficiarioServiceImpl.class);

    private final BeneficiarioRepository beneficiarioRepository;

    public BeneficiarioServiceImpl(BeneficiarioRepository beneficiarioRepository) {
        this.beneficiarioRepository = beneficiarioRepository;
    }

    @Override
    public Beneficiario save(Beneficiario beneficiario) {
        log.debug("Request to save Beneficiario : {}", beneficiario);
        return beneficiarioRepository.save(beneficiario);
    }

    @Override
    public Optional<Beneficiario> partialUpdate(Beneficiario beneficiario) {
        log.debug("Request to partially update Beneficiario : {}", beneficiario);

        return beneficiarioRepository
            .findById(beneficiario.getId())
            .map(
                existingBeneficiario -> {
                    if (beneficiario.getNome() != null) {
                        existingBeneficiario.setNome(beneficiario.getNome());
                    }
                    if (beneficiario.getCpf() != null) {
                        existingBeneficiario.setCpf(beneficiario.getCpf());
                    }
                    if (beneficiario.getRg() != null) {
                        existingBeneficiario.setRg(beneficiario.getRg());
                    }
                    if (beneficiario.getEmail() != null) {
                        existingBeneficiario.setEmail(beneficiario.getEmail());
                    }
                    if (beneficiario.getStatus() != null) {
                        existingBeneficiario.setStatus(beneficiario.getStatus());
                    }

                    return existingBeneficiario;
                }
            )
            .map(beneficiarioRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Beneficiario> findAll(Pageable pageable) {
        log.debug("Request to get all Beneficiarios");
        return beneficiarioRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Beneficiario> findOne(Long id) {
        log.debug("Request to get Beneficiario : {}", id);
        return beneficiarioRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Beneficiario : {}", id);
        beneficiarioRepository.deleteById(id);
    }
}
