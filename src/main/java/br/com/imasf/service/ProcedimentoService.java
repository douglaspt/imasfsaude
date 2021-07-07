package br.com.imasf.service;

import br.com.imasf.domain.Procedimento;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Procedimento}.
 */
public interface ProcedimentoService {
    /**
     * Save a procedimento.
     *
     * @param procedimento the entity to save.
     * @return the persisted entity.
     */
    Procedimento save(Procedimento procedimento);

    /**
     * Partially updates a procedimento.
     *
     * @param procedimento the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Procedimento> partialUpdate(Procedimento procedimento);

    /**
     * Get all the procedimentos.
     *
     * @return the list of entities.
     */
    List<Procedimento> findAll();

    /**
     * Get the "id" procedimento.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Procedimento> findOne(Long id);

    /**
     * Delete the "id" procedimento.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
