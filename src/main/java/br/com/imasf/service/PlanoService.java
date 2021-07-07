package br.com.imasf.service;

import br.com.imasf.domain.Plano;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Plano}.
 */
public interface PlanoService {
    /**
     * Save a plano.
     *
     * @param plano the entity to save.
     * @return the persisted entity.
     */
    Plano save(Plano plano);

    /**
     * Partially updates a plano.
     *
     * @param plano the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Plano> partialUpdate(Plano plano);

    /**
     * Get all the planos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Plano> findAll(Pageable pageable);

    /**
     * Get the "id" plano.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Plano> findOne(Long id);

    /**
     * Delete the "id" plano.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
