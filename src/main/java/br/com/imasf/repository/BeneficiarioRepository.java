package br.com.imasf.repository;

import br.com.imasf.domain.Beneficiario;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Beneficiario entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BeneficiarioRepository extends JpaRepository<Beneficiario, Long> {}
