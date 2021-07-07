package br.com.imasf.service;

import br.com.imasf.domain.Beneficiario;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Beneficiario}.
 */
public interface BeneficiarioService {
    /**
     * Save a beneficiario.
     *
     * @param beneficiario the entity to save.
     * @return the persisted entity.
     */
    Beneficiario save(Beneficiario beneficiario);

    /**
     * Partially updates a beneficiario.
     *
     * @param beneficiario the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Beneficiario> partialUpdate(Beneficiario beneficiario);

    /**
     * Get all the beneficiarios.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Beneficiario> findAll(Pageable pageable);

    /**
     * Get the "id" beneficiario.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Beneficiario> findOne(Long id);

    /**
     * Delete the "id" beneficiario.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
