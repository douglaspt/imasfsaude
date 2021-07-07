package br.com.imasf.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.imasf.IntegrationTest;
import br.com.imasf.domain.Beneficiario;
import br.com.imasf.domain.enumeration.Status;
import br.com.imasf.repository.BeneficiarioRepository;
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
 * Integration tests for the {@link BeneficiarioResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BeneficiarioResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_CPF = "AAAAAAAAAA";
    private static final String UPDATED_CPF = "BBBBBBBBBB";

    private static final String DEFAULT_RG = "AAAAAAAAAA";
    private static final String UPDATED_RG = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.ATIVO;
    private static final Status UPDATED_STATUS = Status.INATIVO;

    private static final String ENTITY_API_URL = "/api/beneficiarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BeneficiarioRepository beneficiarioRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBeneficiarioMockMvc;

    private Beneficiario beneficiario;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Beneficiario createEntity(EntityManager em) {
        Beneficiario beneficiario = new Beneficiario()
            .nome(DEFAULT_NOME)
            .cpf(DEFAULT_CPF)
            .rg(DEFAULT_RG)
            .email(DEFAULT_EMAIL)
            .status(DEFAULT_STATUS);
        return beneficiario;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Beneficiario createUpdatedEntity(EntityManager em) {
        Beneficiario beneficiario = new Beneficiario()
            .nome(UPDATED_NOME)
            .cpf(UPDATED_CPF)
            .rg(UPDATED_RG)
            .email(UPDATED_EMAIL)
            .status(UPDATED_STATUS);
        return beneficiario;
    }

    @BeforeEach
    public void initTest() {
        beneficiario = createEntity(em);
    }

    @Test
    @Transactional
    void createBeneficiario() throws Exception {
        int databaseSizeBeforeCreate = beneficiarioRepository.findAll().size();
        // Create the Beneficiario
        restBeneficiarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(beneficiario)))
            .andExpect(status().isCreated());

        // Validate the Beneficiario in the database
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeCreate + 1);
        Beneficiario testBeneficiario = beneficiarioList.get(beneficiarioList.size() - 1);
        assertThat(testBeneficiario.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testBeneficiario.getCpf()).isEqualTo(DEFAULT_CPF);
        assertThat(testBeneficiario.getRg()).isEqualTo(DEFAULT_RG);
        assertThat(testBeneficiario.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testBeneficiario.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createBeneficiarioWithExistingId() throws Exception {
        // Create the Beneficiario with an existing ID
        beneficiario.setId(1L);

        int databaseSizeBeforeCreate = beneficiarioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBeneficiarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(beneficiario)))
            .andExpect(status().isBadRequest());

        // Validate the Beneficiario in the database
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBeneficiarios() throws Exception {
        // Initialize the database
        beneficiarioRepository.saveAndFlush(beneficiario);

        // Get all the beneficiarioList
        restBeneficiarioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(beneficiario.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].cpf").value(hasItem(DEFAULT_CPF)))
            .andExpect(jsonPath("$.[*].rg").value(hasItem(DEFAULT_RG)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getBeneficiario() throws Exception {
        // Initialize the database
        beneficiarioRepository.saveAndFlush(beneficiario);

        // Get the beneficiario
        restBeneficiarioMockMvc
            .perform(get(ENTITY_API_URL_ID, beneficiario.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(beneficiario.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.cpf").value(DEFAULT_CPF))
            .andExpect(jsonPath("$.rg").value(DEFAULT_RG))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBeneficiario() throws Exception {
        // Get the beneficiario
        restBeneficiarioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBeneficiario() throws Exception {
        // Initialize the database
        beneficiarioRepository.saveAndFlush(beneficiario);

        int databaseSizeBeforeUpdate = beneficiarioRepository.findAll().size();

        // Update the beneficiario
        Beneficiario updatedBeneficiario = beneficiarioRepository.findById(beneficiario.getId()).get();
        // Disconnect from session so that the updates on updatedBeneficiario are not directly saved in db
        em.detach(updatedBeneficiario);
        updatedBeneficiario.nome(UPDATED_NOME).cpf(UPDATED_CPF).rg(UPDATED_RG).email(UPDATED_EMAIL).status(UPDATED_STATUS);

        restBeneficiarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBeneficiario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBeneficiario))
            )
            .andExpect(status().isOk());

        // Validate the Beneficiario in the database
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeUpdate);
        Beneficiario testBeneficiario = beneficiarioList.get(beneficiarioList.size() - 1);
        assertThat(testBeneficiario.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testBeneficiario.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testBeneficiario.getRg()).isEqualTo(UPDATED_RG);
        assertThat(testBeneficiario.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testBeneficiario.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingBeneficiario() throws Exception {
        int databaseSizeBeforeUpdate = beneficiarioRepository.findAll().size();
        beneficiario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBeneficiarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, beneficiario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(beneficiario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Beneficiario in the database
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBeneficiario() throws Exception {
        int databaseSizeBeforeUpdate = beneficiarioRepository.findAll().size();
        beneficiario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBeneficiarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(beneficiario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Beneficiario in the database
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBeneficiario() throws Exception {
        int databaseSizeBeforeUpdate = beneficiarioRepository.findAll().size();
        beneficiario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBeneficiarioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(beneficiario)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Beneficiario in the database
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBeneficiarioWithPatch() throws Exception {
        // Initialize the database
        beneficiarioRepository.saveAndFlush(beneficiario);

        int databaseSizeBeforeUpdate = beneficiarioRepository.findAll().size();

        // Update the beneficiario using partial update
        Beneficiario partialUpdatedBeneficiario = new Beneficiario();
        partialUpdatedBeneficiario.setId(beneficiario.getId());

        partialUpdatedBeneficiario.cpf(UPDATED_CPF).status(UPDATED_STATUS);

        restBeneficiarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBeneficiario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBeneficiario))
            )
            .andExpect(status().isOk());

        // Validate the Beneficiario in the database
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeUpdate);
        Beneficiario testBeneficiario = beneficiarioList.get(beneficiarioList.size() - 1);
        assertThat(testBeneficiario.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testBeneficiario.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testBeneficiario.getRg()).isEqualTo(DEFAULT_RG);
        assertThat(testBeneficiario.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testBeneficiario.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateBeneficiarioWithPatch() throws Exception {
        // Initialize the database
        beneficiarioRepository.saveAndFlush(beneficiario);

        int databaseSizeBeforeUpdate = beneficiarioRepository.findAll().size();

        // Update the beneficiario using partial update
        Beneficiario partialUpdatedBeneficiario = new Beneficiario();
        partialUpdatedBeneficiario.setId(beneficiario.getId());

        partialUpdatedBeneficiario.nome(UPDATED_NOME).cpf(UPDATED_CPF).rg(UPDATED_RG).email(UPDATED_EMAIL).status(UPDATED_STATUS);

        restBeneficiarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBeneficiario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBeneficiario))
            )
            .andExpect(status().isOk());

        // Validate the Beneficiario in the database
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeUpdate);
        Beneficiario testBeneficiario = beneficiarioList.get(beneficiarioList.size() - 1);
        assertThat(testBeneficiario.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testBeneficiario.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testBeneficiario.getRg()).isEqualTo(UPDATED_RG);
        assertThat(testBeneficiario.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testBeneficiario.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingBeneficiario() throws Exception {
        int databaseSizeBeforeUpdate = beneficiarioRepository.findAll().size();
        beneficiario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBeneficiarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, beneficiario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(beneficiario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Beneficiario in the database
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBeneficiario() throws Exception {
        int databaseSizeBeforeUpdate = beneficiarioRepository.findAll().size();
        beneficiario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBeneficiarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(beneficiario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Beneficiario in the database
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBeneficiario() throws Exception {
        int databaseSizeBeforeUpdate = beneficiarioRepository.findAll().size();
        beneficiario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBeneficiarioMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(beneficiario))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Beneficiario in the database
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBeneficiario() throws Exception {
        // Initialize the database
        beneficiarioRepository.saveAndFlush(beneficiario);

        int databaseSizeBeforeDelete = beneficiarioRepository.findAll().size();

        // Delete the beneficiario
        restBeneficiarioMockMvc
            .perform(delete(ENTITY_API_URL_ID, beneficiario.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Beneficiario> beneficiarioList = beneficiarioRepository.findAll();
        assertThat(beneficiarioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
