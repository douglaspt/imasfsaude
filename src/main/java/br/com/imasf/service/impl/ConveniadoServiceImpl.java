package br.com.imasf.service.impl;

import br.com.imasf.domain.Conveniado;
import br.com.imasf.repository.ConveniadoRepository;
import br.com.imasf.service.ConveniadoService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Conveniado}.
 */
@Service
@Transactional
public class ConveniadoServiceImpl implements ConveniadoService {

    private final Logger log = LoggerFactory.getLogger(ConveniadoServiceImpl.class);

    private final ConveniadoRepository conveniadoRepository;

    public ConveniadoServiceImpl(ConveniadoRepository conveniadoRepository) {
        this.conveniadoRepository = conveniadoRepository;
    }

    @Override
    public Conveniado save(Conveniado conveniado) {
        log.debug("Request to save Conveniado : {}", conveniado);
        return conveniadoRepository.save(conveniado);
    }

    @Override
    public Optional<Conveniado> partialUpdate(Conveniado conveniado) {
        log.debug("Request to partially update Conveniado : {}", conveniado);

        return conveniadoRepository
            .findById(conveniado.getId())
            .map(
                existingConveniado -> {
                    if (conveniado.getNome() != null) {
                        existingConveniado.setNome(conveniado.getNome());
                    }
                    if (conveniado.getCnpj() != null) {
                        existingConveniado.setCnpj(conveniado.getCnpj());
                    }
                    if (conveniado.getContrato() != null) {
                        existingConveniado.setContrato(conveniado.getContrato());
                    }
                    if (conveniado.getRg() != null) {
                        existingConveniado.setRg(conveniado.getRg());
                    }
                    if (conveniado.getEmail() != null) {
                        existingConveniado.setEmail(conveniado.getEmail());
                    }
                    if (conveniado.getTelefone() != null) {
                        existingConveniado.setTelefone(conveniado.getTelefone());
                    }
                    if (conveniado.getStatus() != null) {
                        existingConveniado.setStatus(conveniado.getStatus());
                    }

                    return existingConveniado;
                }
            )
            .map(conveniadoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Conveniado> findAll(Pageable pageable) {
        log.debug("Request to get all Conveniados");
        return conveniadoRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Conveniado> findOne(Long id) {
        log.debug("Request to get Conveniado : {}", id);
        return conveniadoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Conveniado : {}", id);
        conveniadoRepository.deleteById(id);
    }
}
