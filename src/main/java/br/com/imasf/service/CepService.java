package br.com.imasf.service;

import br.com.imasf.domain.Cep;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Cep}.
 */
public interface CepService {
    /**
     * Save a cep.
     *
     * @param cep the entity to save.
     * @return the persisted entity.
     */
    Cep save(Cep cep);

    /**
     * Partially updates a cep.
     *
     * @param cep the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Cep> partialUpdate(Cep cep);

    /**
     * Get all the ceps.
     *
     * @return the list of entities.
     */
    List<Cep> findAll();

    /**
     * Get the "id" cep.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Cep> findOne(Long id);

    /**
     * Delete the "id" cep.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
