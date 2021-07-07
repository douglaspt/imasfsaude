package br.com.imasf.service.impl;

import br.com.imasf.domain.Cep;
import br.com.imasf.repository.CepRepository;
import br.com.imasf.service.CepService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Cep}.
 */
@Service
@Transactional
public class CepServiceImpl implements CepService {

    private final Logger log = LoggerFactory.getLogger(CepServiceImpl.class);

    private final CepRepository cepRepository;

    public CepServiceImpl(CepRepository cepRepository) {
        this.cepRepository = cepRepository;
    }

    @Override
    public Cep save(Cep cep) {
        log.debug("Request to save Cep : {}", cep);
        return cepRepository.save(cep);
    }

    @Override
    public Optional<Cep> partialUpdate(Cep cep) {
        log.debug("Request to partially update Cep : {}", cep);

        return cepRepository
            .findById(cep.getId())
            .map(
                existingCep -> {
                    if (cep.getLogradouro() != null) {
                        existingCep.setLogradouro(cep.getLogradouro());
                    }
                    if (cep.getBairro() != null) {
                        existingCep.setBairro(cep.getBairro());
                    }
                    if (cep.getCidade() != null) {
                        existingCep.setCidade(cep.getCidade());
                    }
                    if (cep.getuF() != null) {
                        existingCep.setuF(cep.getuF());
                    }

                    return existingCep;
                }
            )
            .map(cepRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Cep> findAll() {
        log.debug("Request to get all Ceps");
        return cepRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Cep> findOne(Long id) {
        log.debug("Request to get Cep : {}", id);
        return cepRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Cep : {}", id);
        cepRepository.deleteById(id);
    }
}
