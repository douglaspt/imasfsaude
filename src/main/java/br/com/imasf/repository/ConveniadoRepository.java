package br.com.imasf.repository;

import br.com.imasf.domain.Conveniado;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Conveniado entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConveniadoRepository extends JpaRepository<Conveniado, Long> {}
