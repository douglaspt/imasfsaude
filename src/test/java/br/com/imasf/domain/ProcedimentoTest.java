package br.com.imasf.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.imasf.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProcedimentoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Procedimento.class);
        Procedimento procedimento1 = new Procedimento();
        procedimento1.setId(1L);
        Procedimento procedimento2 = new Procedimento();
        procedimento2.setId(procedimento1.getId());
        assertThat(procedimento1).isEqualTo(procedimento2);
        procedimento2.setId(2L);
        assertThat(procedimento1).isNotEqualTo(procedimento2);
        procedimento1.setId(null);
        assertThat(procedimento1).isNotEqualTo(procedimento2);
    }
}
