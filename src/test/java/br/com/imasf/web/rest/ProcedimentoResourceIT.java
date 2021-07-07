package br.com.imasf.web.rest;

import static br.com.imasf.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.imasf.IntegrationTest;
import br.com.imasf.domain.Procedimento;
import br.com.imasf.repository.ProcedimentoRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProcedimentoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProcedimentoResourceIT {

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final Integer DEFAULT_QUANTIDADE = 1;
    private static final Integer UPDATED_QUANTIDADE = 2;

    private static final BigDecimal DEFAULT_VALOR_INFORMADO = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALOR_INFORMADO = new BigDecimal(2);

    private static final BigDecimal DEFAULT_VALOR_PAGO = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALOR_PAGO = new BigDecimal(2);

    private static final BigDecimal DEFAULT_GLOSA = new BigDecimal(1);
    private static final BigDecimal UPDATED_GLOSA = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/procedimentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProcedimentoRepository procedimentoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProcedimentoMockMvc;

    private Procedimento procedimento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Procedimento createEntity(EntityManager em) {
        Procedimento procedimento = new Procedimento()
            .descricao(DEFAULT_DESCRICAO)
            .quantidade(DEFAULT_QUANTIDADE)
            .valorInformado(DEFAULT_VALOR_INFORMADO)
            .valorPago(DEFAULT_VALOR_PAGO)
            .glosa(DEFAULT_GLOSA);
        return procedimento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Procedimento createUpdatedEntity(EntityManager em) {
        Procedimento procedimento = new Procedimento()
            .descricao(UPDATED_DESCRICAO)
            .quantidade(UPDATED_QUANTIDADE)
            .valorInformado(UPDATED_VALOR_INFORMADO)
            .valorPago(UPDATED_VALOR_PAGO)
            .glosa(UPDATED_GLOSA);
        return procedimento;
    }

    @BeforeEach
    public void initTest() {
        procedimento = createEntity(em);
    }

    @Test
    @Transactional
    void createProcedimento() throws Exception {
        int databaseSizeBeforeCreate = procedimentoRepository.findAll().size();
        // Create the Procedimento
        restProcedimentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(procedimento)))
            .andExpect(status().isCreated());

        // Validate the Procedimento in the database
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeCreate + 1);
        Procedimento testProcedimento = procedimentoList.get(procedimentoList.size() - 1);
        assertThat(testProcedimento.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testProcedimento.getQuantidade()).isEqualTo(DEFAULT_QUANTIDADE);
        assertThat(testProcedimento.getValorInformado()).isEqualByComparingTo(DEFAULT_VALOR_INFORMADO);
        assertThat(testProcedimento.getValorPago()).isEqualByComparingTo(DEFAULT_VALOR_PAGO);
        assertThat(testProcedimento.getGlosa()).isEqualByComparingTo(DEFAULT_GLOSA);
    }

    @Test
    @Transactional
    void createProcedimentoWithExistingId() throws Exception {
        // Create the Procedimento with an existing ID
        procedimento.setId(1L);

        int databaseSizeBeforeCreate = procedimentoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProcedimentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(procedimento)))
            .andExpect(status().isBadRequest());

        // Validate the Procedimento in the database
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProcedimentos() throws Exception {
        // Initialize the database
        procedimentoRepository.saveAndFlush(procedimento);

        // Get all the procedimentoList
        restProcedimentoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(procedimento.getId().intValue())))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)))
            .andExpect(jsonPath("$.[*].quantidade").value(hasItem(DEFAULT_QUANTIDADE)))
            .andExpect(jsonPath("$.[*].valorInformado").value(hasItem(sameNumber(DEFAULT_VALOR_INFORMADO))))
            .andExpect(jsonPath("$.[*].valorPago").value(hasItem(sameNumber(DEFAULT_VALOR_PAGO))))
            .andExpect(jsonPath("$.[*].glosa").value(hasItem(sameNumber(DEFAULT_GLOSA))));
    }

    @Test
    @Transactional
    void getProcedimento() throws Exception {
        // Initialize the database
        procedimentoRepository.saveAndFlush(procedimento);

        // Get the procedimento
        restProcedimentoMockMvc
            .perform(get(ENTITY_API_URL_ID, procedimento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(procedimento.getId().intValue()))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO))
            .andExpect(jsonPath("$.quantidade").value(DEFAULT_QUANTIDADE))
            .andExpect(jsonPath("$.valorInformado").value(sameNumber(DEFAULT_VALOR_INFORMADO)))
            .andExpect(jsonPath("$.valorPago").value(sameNumber(DEFAULT_VALOR_PAGO)))
            .andExpect(jsonPath("$.glosa").value(sameNumber(DEFAULT_GLOSA)));
    }

    @Test
    @Transactional
    void getNonExistingProcedimento() throws Exception {
        // Get the procedimento
        restProcedimentoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProcedimento() throws Exception {
        // Initialize the database
        procedimentoRepository.saveAndFlush(procedimento);

        int databaseSizeBeforeUpdate = procedimentoRepository.findAll().size();

        // Update the procedimento
        Procedimento updatedProcedimento = procedimentoRepository.findById(procedimento.getId()).get();
        // Disconnect from session so that the updates on updatedProcedimento are not directly saved in db
        em.detach(updatedProcedimento);
        updatedProcedimento
            .descricao(UPDATED_DESCRICAO)
            .quantidade(UPDATED_QUANTIDADE)
            .valorInformado(UPDATED_VALOR_INFORMADO)
            .valorPago(UPDATED_VALOR_PAGO)
            .glosa(UPDATED_GLOSA);

        restProcedimentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProcedimento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProcedimento))
            )
            .andExpect(status().isOk());

        // Validate the Procedimento in the database
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeUpdate);
        Procedimento testProcedimento = procedimentoList.get(procedimentoList.size() - 1);
        assertThat(testProcedimento.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testProcedimento.getQuantidade()).isEqualTo(UPDATED_QUANTIDADE);
        assertThat(testProcedimento.getValorInformado()).isEqualTo(UPDATED_VALOR_INFORMADO);
        assertThat(testProcedimento.getValorPago()).isEqualTo(UPDATED_VALOR_PAGO);
        assertThat(testProcedimento.getGlosa()).isEqualTo(UPDATED_GLOSA);
    }

    @Test
    @Transactional
    void putNonExistingProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = procedimentoRepository.findAll().size();
        procedimento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProcedimentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, procedimento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(procedimento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Procedimento in the database
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = procedimentoRepository.findAll().size();
        procedimento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcedimentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(procedimento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Procedimento in the database
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = procedimentoRepository.findAll().size();
        procedimento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcedimentoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(procedimento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Procedimento in the database
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProcedimentoWithPatch() throws Exception {
        // Initialize the database
        procedimentoRepository.saveAndFlush(procedimento);

        int databaseSizeBeforeUpdate = procedimentoRepository.findAll().size();

        // Update the procedimento using partial update
        Procedimento partialUpdatedProcedimento = new Procedimento();
        partialUpdatedProcedimento.setId(procedimento.getId());

        partialUpdatedProcedimento.descricao(UPDATED_DESCRICAO).quantidade(UPDATED_QUANTIDADE);

        restProcedimentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProcedimento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProcedimento))
            )
            .andExpect(status().isOk());

        // Validate the Procedimento in the database
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeUpdate);
        Procedimento testProcedimento = procedimentoList.get(procedimentoList.size() - 1);
        assertThat(testProcedimento.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testProcedimento.getQuantidade()).isEqualTo(UPDATED_QUANTIDADE);
        assertThat(testProcedimento.getValorInformado()).isEqualByComparingTo(DEFAULT_VALOR_INFORMADO);
        assertThat(testProcedimento.getValorPago()).isEqualByComparingTo(DEFAULT_VALOR_PAGO);
        assertThat(testProcedimento.getGlosa()).isEqualByComparingTo(DEFAULT_GLOSA);
    }

    @Test
    @Transactional
    void fullUpdateProcedimentoWithPatch() throws Exception {
        // Initialize the database
        procedimentoRepository.saveAndFlush(procedimento);

        int databaseSizeBeforeUpdate = procedimentoRepository.findAll().size();

        // Update the procedimento using partial update
        Procedimento partialUpdatedProcedimento = new Procedimento();
        partialUpdatedProcedimento.setId(procedimento.getId());

        partialUpdatedProcedimento
            .descricao(UPDATED_DESCRICAO)
            .quantidade(UPDATED_QUANTIDADE)
            .valorInformado(UPDATED_VALOR_INFORMADO)
            .valorPago(UPDATED_VALOR_PAGO)
            .glosa(UPDATED_GLOSA);

        restProcedimentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProcedimento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProcedimento))
            )
            .andExpect(status().isOk());

        // Validate the Procedimento in the database
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeUpdate);
        Procedimento testProcedimento = procedimentoList.get(procedimentoList.size() - 1);
        assertThat(testProcedimento.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testProcedimento.getQuantidade()).isEqualTo(UPDATED_QUANTIDADE);
        assertThat(testProcedimento.getValorInformado()).isEqualByComparingTo(UPDATED_VALOR_INFORMADO);
        assertThat(testProcedimento.getValorPago()).isEqualByComparingTo(UPDATED_VALOR_PAGO);
        assertThat(testProcedimento.getGlosa()).isEqualByComparingTo(UPDATED_GLOSA);
    }

    @Test
    @Transactional
    void patchNonExistingProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = procedimentoRepository.findAll().size();
        procedimento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProcedimentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, procedimento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(procedimento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Procedimento in the database
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = procedimentoRepository.findAll().size();
        procedimento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcedimentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(procedimento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Procedimento in the database
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProcedimento() throws Exception {
        int databaseSizeBeforeUpdate = procedimentoRepository.findAll().size();
        procedimento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProcedimentoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(procedimento))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Procedimento in the database
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProcedimento() throws Exception {
        // Initialize the database
        procedimentoRepository.saveAndFlush(procedimento);

        int databaseSizeBeforeDelete = procedimentoRepository.findAll().size();

        // Delete the procedimento
        restProcedimentoMockMvc
            .perform(delete(ENTITY_API_URL_ID, procedimento.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Procedimento> procedimentoList = procedimentoRepository.findAll();
        assertThat(procedimentoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
