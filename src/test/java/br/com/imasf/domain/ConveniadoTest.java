package br.com.imasf.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.imasf.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConveniadoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Conveniado.class);
        Conveniado conveniado1 = new Conveniado();
        conveniado1.setId(1L);
        Conveniado conveniado2 = new Conveniado();
        conveniado2.setId(conveniado1.getId());
        assertThat(conveniado1).isEqualTo(conveniado2);
        conveniado2.setId(2L);
        assertThat(conveniado1).isNotEqualTo(conveniado2);
        conveniado1.setId(null);
        assertThat(conveniado1).isNotEqualTo(conveniado2);
    }
}
