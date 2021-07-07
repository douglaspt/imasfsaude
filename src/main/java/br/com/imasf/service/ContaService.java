package br.com.imasf.service;

import br.com.imasf.domain.Conta;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Conta}.
 */
public interface ContaService {
    /**
     * Save a conta.
     *
     * @param conta the entity to save.
     * @return the persisted entity.
     */
    Conta save(Conta conta);

    /**
     * Partially updates a conta.
     *
     * @param conta the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Conta> partialUpdate(Conta conta);

    /**
     * Get all the contas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Conta> findAll(Pageable pageable);

    /**
     * Get the "id" conta.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Conta> findOne(Long id);

    /**
     * Delete the "id" conta.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
