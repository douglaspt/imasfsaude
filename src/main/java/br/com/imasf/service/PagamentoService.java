package br.com.imasf.service;

import br.com.imasf.domain.Pagamento;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Pagamento}.
 */
public interface PagamentoService {
    /**
     * Save a pagamento.
     *
     * @param pagamento the entity to save.
     * @return the persisted entity.
     */
    Pagamento save(Pagamento pagamento);

    /**
     * Partially updates a pagamento.
     *
     * @param pagamento the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Pagamento> partialUpdate(Pagamento pagamento);

    /**
     * Get all the pagamentos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Pagamento> findAll(Pageable pageable);

    /**
     * Get the "id" pagamento.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Pagamento> findOne(Long id);

    /**
     * Delete the "id" pagamento.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
