package br.com.imasf.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.imasf.IntegrationTest;
import br.com.imasf.domain.Cep;
import br.com.imasf.repository.CepRepository;
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
 * Integration tests for the {@link CepResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CepResourceIT {

    private static final String DEFAULT_LOGRADOURO = "AAAAAAAAAA";
    private static final String UPDATED_LOGRADOURO = "BBBBBBBBBB";

    private static final String DEFAULT_BAIRRO = "AAAAAAAAAA";
    private static final String UPDATED_BAIRRO = "BBBBBBBBBB";

    private static final String DEFAULT_CIDADE = "AAAAAAAAAA";
    private static final String UPDATED_CIDADE = "BBBBBBBBBB";

    private static final String DEFAULT_U_F = "AAAAAAAAAA";
    private static final String UPDATED_U_F = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ceps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CepRepository cepRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCepMockMvc;

    private Cep cep;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cep createEntity(EntityManager em) {
        Cep cep = new Cep().logradouro(DEFAULT_LOGRADOURO).bairro(DEFAULT_BAIRRO).cidade(DEFAULT_CIDADE).uF(DEFAULT_U_F);
        return cep;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cep createUpdatedEntity(EntityManager em) {
        Cep cep = new Cep().logradouro(UPDATED_LOGRADOURO).bairro(UPDATED_BAIRRO).cidade(UPDATED_CIDADE).uF(UPDATED_U_F);
        return cep;
    }

    @BeforeEach
    public void initTest() {
        cep = createEntity(em);
    }

    @Test
    @Transactional
    void createCep() throws Exception {
        int databaseSizeBeforeCreate = cepRepository.findAll().size();
        // Create the Cep
        restCepMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cep)))
            .andExpect(status().isCreated());

        // Validate the Cep in the database
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeCreate + 1);
        Cep testCep = cepList.get(cepList.size() - 1);
        assertThat(testCep.getLogradouro()).isEqualTo(DEFAULT_LOGRADOURO);
        assertThat(testCep.getBairro()).isEqualTo(DEFAULT_BAIRRO);
        assertThat(testCep.getCidade()).isEqualTo(DEFAULT_CIDADE);
        assertThat(testCep.getuF()).isEqualTo(DEFAULT_U_F);
    }

    @Test
    @Transactional
    void createCepWithExistingId() throws Exception {
        // Create the Cep with an existing ID
        cep.setId(1L);

        int databaseSizeBeforeCreate = cepRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCepMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cep)))
            .andExpect(status().isBadRequest());

        // Validate the Cep in the database
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCeps() throws Exception {
        // Initialize the database
        cepRepository.saveAndFlush(cep);

        // Get all the cepList
        restCepMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cep.getId().intValue())))
            .andExpect(jsonPath("$.[*].logradouro").value(hasItem(DEFAULT_LOGRADOURO)))
            .andExpect(jsonPath("$.[*].bairro").value(hasItem(DEFAULT_BAIRRO)))
            .andExpect(jsonPath("$.[*].cidade").value(hasItem(DEFAULT_CIDADE)))
            .andExpect(jsonPath("$.[*].uF").value(hasItem(DEFAULT_U_F)));
    }

    @Test
    @Transactional
    void getCep() throws Exception {
        // Initialize the database
        cepRepository.saveAndFlush(cep);

        // Get the cep
        restCepMockMvc
            .perform(get(ENTITY_API_URL_ID, cep.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cep.getId().intValue()))
            .andExpect(jsonPath("$.logradouro").value(DEFAULT_LOGRADOURO))
            .andExpect(jsonPath("$.bairro").value(DEFAULT_BAIRRO))
            .andExpect(jsonPath("$.cidade").value(DEFAULT_CIDADE))
            .andExpect(jsonPath("$.uF").value(DEFAULT_U_F));
    }

    @Test
    @Transactional
    void getNonExistingCep() throws Exception {
        // Get the cep
        restCepMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCep() throws Exception {
        // Initialize the database
        cepRepository.saveAndFlush(cep);

        int databaseSizeBeforeUpdate = cepRepository.findAll().size();

        // Update the cep
        Cep updatedCep = cepRepository.findById(cep.getId()).get();
        // Disconnect from session so that the updates on updatedCep are not directly saved in db
        em.detach(updatedCep);
        updatedCep.logradouro(UPDATED_LOGRADOURO).bairro(UPDATED_BAIRRO).cidade(UPDATED_CIDADE).uF(UPDATED_U_F);

        restCepMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCep.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCep))
            )
            .andExpect(status().isOk());

        // Validate the Cep in the database
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeUpdate);
        Cep testCep = cepList.get(cepList.size() - 1);
        assertThat(testCep.getLogradouro()).isEqualTo(UPDATED_LOGRADOURO);
        assertThat(testCep.getBairro()).isEqualTo(UPDATED_BAIRRO);
        assertThat(testCep.getCidade()).isEqualTo(UPDATED_CIDADE);
        assertThat(testCep.getuF()).isEqualTo(UPDATED_U_F);
    }

    @Test
    @Transactional
    void putNonExistingCep() throws Exception {
        int databaseSizeBeforeUpdate = cepRepository.findAll().size();
        cep.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCepMockMvc
            .perform(
                put(ENTITY_API_URL_ID, cep.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cep))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cep in the database
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCep() throws Exception {
        int databaseSizeBeforeUpdate = cepRepository.findAll().size();
        cep.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCepMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cep))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cep in the database
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCep() throws Exception {
        int databaseSizeBeforeUpdate = cepRepository.findAll().size();
        cep.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCepMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cep)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cep in the database
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCepWithPatch() throws Exception {
        // Initialize the database
        cepRepository.saveAndFlush(cep);

        int databaseSizeBeforeUpdate = cepRepository.findAll().size();

        // Update the cep using partial update
        Cep partialUpdatedCep = new Cep();
        partialUpdatedCep.setId(cep.getId());

        partialUpdatedCep.bairro(UPDATED_BAIRRO).cidade(UPDATED_CIDADE).uF(UPDATED_U_F);

        restCepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCep.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCep))
            )
            .andExpect(status().isOk());

        // Validate the Cep in the database
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeUpdate);
        Cep testCep = cepList.get(cepList.size() - 1);
        assertThat(testCep.getLogradouro()).isEqualTo(DEFAULT_LOGRADOURO);
        assertThat(testCep.getBairro()).isEqualTo(UPDATED_BAIRRO);
        assertThat(testCep.getCidade()).isEqualTo(UPDATED_CIDADE);
        assertThat(testCep.getuF()).isEqualTo(UPDATED_U_F);
    }

    @Test
    @Transactional
    void fullUpdateCepWithPatch() throws Exception {
        // Initialize the database
        cepRepository.saveAndFlush(cep);

        int databaseSizeBeforeUpdate = cepRepository.findAll().size();

        // Update the cep using partial update
        Cep partialUpdatedCep = new Cep();
        partialUpdatedCep.setId(cep.getId());

        partialUpdatedCep.logradouro(UPDATED_LOGRADOURO).bairro(UPDATED_BAIRRO).cidade(UPDATED_CIDADE).uF(UPDATED_U_F);

        restCepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCep.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCep))
            )
            .andExpect(status().isOk());

        // Validate the Cep in the database
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeUpdate);
        Cep testCep = cepList.get(cepList.size() - 1);
        assertThat(testCep.getLogradouro()).isEqualTo(UPDATED_LOGRADOURO);
        assertThat(testCep.getBairro()).isEqualTo(UPDATED_BAIRRO);
        assertThat(testCep.getCidade()).isEqualTo(UPDATED_CIDADE);
        assertThat(testCep.getuF()).isEqualTo(UPDATED_U_F);
    }

    @Test
    @Transactional
    void patchNonExistingCep() throws Exception {
        int databaseSizeBeforeUpdate = cepRepository.findAll().size();
        cep.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cep.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cep))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cep in the database
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCep() throws Exception {
        int databaseSizeBeforeUpdate = cepRepository.findAll().size();
        cep.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCepMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cep))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cep in the database
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCep() throws Exception {
        int databaseSizeBeforeUpdate = cepRepository.findAll().size();
        cep.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCepMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(cep)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cep in the database
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCep() throws Exception {
        // Initialize the database
        cepRepository.saveAndFlush(cep);

        int databaseSizeBeforeDelete = cepRepository.findAll().size();

        // Delete the cep
        restCepMockMvc.perform(delete(ENTITY_API_URL_ID, cep.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Cep> cepList = cepRepository.findAll();
        assertThat(cepList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
