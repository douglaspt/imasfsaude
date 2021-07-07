package br.com.imasf.service;

import br.com.imasf.domain.Conveniado;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Conveniado}.
 */
public interface ConveniadoService {
    /**
     * Save a conveniado.
     *
     * @param conveniado the entity to save.
     * @return the persisted entity.
     */
    Conveniado save(Conveniado conveniado);

    /**
     * Partially updates a conveniado.
     *
     * @param conveniado the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Conveniado> partialUpdate(Conveniado conveniado);

    /**
     * Get all the conveniados.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Conveniado> findAll(Pageable pageable);

    /**
     * Get the "id" conveniado.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Conveniado> findOne(Long id);

    /**
     * Delete the "id" conveniado.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
