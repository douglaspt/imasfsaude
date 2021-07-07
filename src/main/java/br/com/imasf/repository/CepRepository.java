package br.com.imasf.repository;

import br.com.imasf.domain.Cep;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Cep entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CepRepository extends JpaRepository<Cep, Long> {}
