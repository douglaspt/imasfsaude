package br.com.imasf.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.imasf.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlanoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Plano.class);
        Plano plano1 = new Plano();
        plano1.setId(1L);
        Plano plano2 = new Plano();
        plano2.setId(plano1.getId());
        assertThat(plano1).isEqualTo(plano2);
        plano2.setId(2L);
        assertThat(plano1).isNotEqualTo(plano2);
        plano1.setId(null);
        assertThat(plano1).isNotEqualTo(plano2);
    }
}
