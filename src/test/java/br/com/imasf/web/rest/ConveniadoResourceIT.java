package br.com.imasf.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.imasf.IntegrationTest;
import br.com.imasf.domain.Conveniado;
import br.com.imasf.domain.enumeration.Status;
import br.com.imasf.repository.ConveniadoRepository;
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
 * Integration tests for the {@link ConveniadoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConveniadoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_CNPJ = "AAAAAAAAAA";
    private static final String UPDATED_CNPJ = "BBBBBBBBBB";

    private static final String DEFAULT_CONTRATO = "AAAAAAAAAA";
    private static final String UPDATED_CONTRATO = "BBBBBBBBBB";

    private static final String DEFAULT_RG = "AAAAAAAAAA";
    private static final String UPDATED_RG = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_TELEFONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEFONE = "BBBBBBBBBB";

    private static final Status DEFAULT_STATUS = Status.ATIVO;
    private static final Status UPDATED_STATUS = Status.INATIVO;

    private static final String ENTITY_API_URL = "/api/conveniados";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConveniadoRepository conveniadoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConveniadoMockMvc;

    private Conveniado conveniado;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Conveniado createEntity(EntityManager em) {
        Conveniado conveniado = new Conveniado()
            .nome(DEFAULT_NOME)
            .cnpj(DEFAULT_CNPJ)
            .contrato(DEFAULT_CONTRATO)
            .rg(DEFAULT_RG)
            .email(DEFAULT_EMAIL)
            .telefone(DEFAULT_TELEFONE)
            .status(DEFAULT_STATUS);
        return conveniado;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Conveniado createUpdatedEntity(EntityManager em) {
        Conveniado conveniado = new Conveniado()
            .nome(UPDATED_NOME)
            .cnpj(UPDATED_CNPJ)
            .contrato(UPDATED_CONTRATO)
            .rg(UPDATED_RG)
            .email(UPDATED_EMAIL)
            .telefone(UPDATED_TELEFONE)
            .status(UPDATED_STATUS);
        return conveniado;
    }

    @BeforeEach
    public void initTest() {
        conveniado = createEntity(em);
    }

    @Test
    @Transactional
    void createConveniado() throws Exception {
        int databaseSizeBeforeCreate = conveniadoRepository.findAll().size();
        // Create the Conveniado
        restConveniadoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(conveniado)))
            .andExpect(status().isCreated());

        // Validate the Conveniado in the database
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeCreate + 1);
        Conveniado testConveniado = conveniadoList.get(conveniadoList.size() - 1);
        assertThat(testConveniado.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testConveniado.getCnpj()).isEqualTo(DEFAULT_CNPJ);
        assertThat(testConveniado.getContrato()).isEqualTo(DEFAULT_CONTRATO);
        assertThat(testConveniado.getRg()).isEqualTo(DEFAULT_RG);
        assertThat(testConveniado.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testConveniado.getTelefone()).isEqualTo(DEFAULT_TELEFONE);
        assertThat(testConveniado.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createConveniadoWithExistingId() throws Exception {
        // Create the Conveniado with an existing ID
        conveniado.setId(1L);

        int databaseSizeBeforeCreate = conveniadoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConveniadoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(conveniado)))
            .andExpect(status().isBadRequest());

        // Validate the Conveniado in the database
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConveniados() throws Exception {
        // Initialize the database
        conveniadoRepository.saveAndFlush(conveniado);

        // Get all the conveniadoList
        restConveniadoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(conveniado.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].cnpj").value(hasItem(DEFAULT_CNPJ)))
            .andExpect(jsonPath("$.[*].contrato").value(hasItem(DEFAULT_CONTRATO)))
            .andExpect(jsonPath("$.[*].rg").value(hasItem(DEFAULT_RG)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].telefone").value(hasItem(DEFAULT_TELEFONE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getConveniado() throws Exception {
        // Initialize the database
        conveniadoRepository.saveAndFlush(conveniado);

        // Get the conveniado
        restConveniadoMockMvc
            .perform(get(ENTITY_API_URL_ID, conveniado.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(conveniado.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.cnpj").value(DEFAULT_CNPJ))
            .andExpect(jsonPath("$.contrato").value(DEFAULT_CONTRATO))
            .andExpect(jsonPath("$.rg").value(DEFAULT_RG))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.telefone").value(DEFAULT_TELEFONE))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingConveniado() throws Exception {
        // Get the conveniado
        restConveniadoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewConveniado() throws Exception {
        // Initialize the database
        conveniadoRepository.saveAndFlush(conveniado);

        int databaseSizeBeforeUpdate = conveniadoRepository.findAll().size();

        // Update the conveniado
        Conveniado updatedConveniado = conveniadoRepository.findById(conveniado.getId()).get();
        // Disconnect from session so that the updates on updatedConveniado are not directly saved in db
        em.detach(updatedConveniado);
        updatedConveniado
            .nome(UPDATED_NOME)
            .cnpj(UPDATED_CNPJ)
            .contrato(UPDATED_CONTRATO)
            .rg(UPDATED_RG)
            .email(UPDATED_EMAIL)
            .telefone(UPDATED_TELEFONE)
            .status(UPDATED_STATUS);

        restConveniadoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConveniado.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConveniado))
            )
            .andExpect(status().isOk());

        // Validate the Conveniado in the database
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeUpdate);
        Conveniado testConveniado = conveniadoList.get(conveniadoList.size() - 1);
        assertThat(testConveniado.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testConveniado.getCnpj()).isEqualTo(UPDATED_CNPJ);
        assertThat(testConveniado.getContrato()).isEqualTo(UPDATED_CONTRATO);
        assertThat(testConveniado.getRg()).isEqualTo(UPDATED_RG);
        assertThat(testConveniado.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testConveniado.getTelefone()).isEqualTo(UPDATED_TELEFONE);
        assertThat(testConveniado.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingConveniado() throws Exception {
        int databaseSizeBeforeUpdate = conveniadoRepository.findAll().size();
        conveniado.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConveniadoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, conveniado.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(conveniado))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conveniado in the database
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConveniado() throws Exception {
        int databaseSizeBeforeUpdate = conveniadoRepository.findAll().size();
        conveniado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConveniadoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(conveniado))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conveniado in the database
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConveniado() throws Exception {
        int databaseSizeBeforeUpdate = conveniadoRepository.findAll().size();
        conveniado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConveniadoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(conveniado)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Conveniado in the database
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConveniadoWithPatch() throws Exception {
        // Initialize the database
        conveniadoRepository.saveAndFlush(conveniado);

        int databaseSizeBeforeUpdate = conveniadoRepository.findAll().size();

        // Update the conveniado using partial update
        Conveniado partialUpdatedConveniado = new Conveniado();
        partialUpdatedConveniado.setId(conveniado.getId());

        partialUpdatedConveniado.nome(UPDATED_NOME).cnpj(UPDATED_CNPJ).contrato(UPDATED_CONTRATO).rg(UPDATED_RG);

        restConveniadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConveniado.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConveniado))
            )
            .andExpect(status().isOk());

        // Validate the Conveniado in the database
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeUpdate);
        Conveniado testConveniado = conveniadoList.get(conveniadoList.size() - 1);
        assertThat(testConveniado.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testConveniado.getCnpj()).isEqualTo(UPDATED_CNPJ);
        assertThat(testConveniado.getContrato()).isEqualTo(UPDATED_CONTRATO);
        assertThat(testConveniado.getRg()).isEqualTo(UPDATED_RG);
        assertThat(testConveniado.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testConveniado.getTelefone()).isEqualTo(DEFAULT_TELEFONE);
        assertThat(testConveniado.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateConveniadoWithPatch() throws Exception {
        // Initialize the database
        conveniadoRepository.saveAndFlush(conveniado);

        int databaseSizeBeforeUpdate = conveniadoRepository.findAll().size();

        // Update the conveniado using partial update
        Conveniado partialUpdatedConveniado = new Conveniado();
        partialUpdatedConveniado.setId(conveniado.getId());

        partialUpdatedConveniado
            .nome(UPDATED_NOME)
            .cnpj(UPDATED_CNPJ)
            .contrato(UPDATED_CONTRATO)
            .rg(UPDATED_RG)
            .email(UPDATED_EMAIL)
            .telefone(UPDATED_TELEFONE)
            .status(UPDATED_STATUS);

        restConveniadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConveniado.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConveniado))
            )
            .andExpect(status().isOk());

        // Validate the Conveniado in the database
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeUpdate);
        Conveniado testConveniado = conveniadoList.get(conveniadoList.size() - 1);
        assertThat(testConveniado.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testConveniado.getCnpj()).isEqualTo(UPDATED_CNPJ);
        assertThat(testConveniado.getContrato()).isEqualTo(UPDATED_CONTRATO);
        assertThat(testConveniado.getRg()).isEqualTo(UPDATED_RG);
        assertThat(testConveniado.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testConveniado.getTelefone()).isEqualTo(UPDATED_TELEFONE);
        assertThat(testConveniado.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingConveniado() throws Exception {
        int databaseSizeBeforeUpdate = conveniadoRepository.findAll().size();
        conveniado.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConveniadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, conveniado.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(conveniado))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conveniado in the database
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConveniado() throws Exception {
        int databaseSizeBeforeUpdate = conveniadoRepository.findAll().size();
        conveniado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConveniadoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(conveniado))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conveniado in the database
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConveniado() throws Exception {
        int databaseSizeBeforeUpdate = conveniadoRepository.findAll().size();
        conveniado.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConveniadoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(conveniado))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Conveniado in the database
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConveniado() throws Exception {
        // Initialize the database
        conveniadoRepository.saveAndFlush(conveniado);

        int databaseSizeBeforeDelete = conveniadoRepository.findAll().size();

        // Delete the conveniado
        restConveniadoMockMvc
            .perform(delete(ENTITY_API_URL_ID, conveniado.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Conveniado> conveniadoList = conveniadoRepository.findAll();
        assertThat(conveniadoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
