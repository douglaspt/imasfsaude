package br.com.imasf.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.imasf.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CepTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cep.class);
        Cep cep1 = new Cep();
        cep1.setId(1L);
        Cep cep2 = new Cep();
        cep2.setId(cep1.getId());
        assertThat(cep1).isEqualTo(cep2);
        cep2.setId(2L);
        assertThat(cep1).isNotEqualTo(cep2);
        cep1.setId(null);
        assertThat(cep1).isNotEqualTo(cep2);
    }
}
