package br.com.imasf.web.rest;

import static br.com.imasf.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.imasf.IntegrationTest;
import br.com.imasf.domain.Pagamento;
import br.com.imasf.domain.enumeration.StatusPagamento;
import br.com.imasf.repository.PagamentoRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link PagamentoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PagamentoResourceIT {

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_EMISSAO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EMISSAO = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_VENCIMENTO = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_VENCIMENTO = LocalDate.now(ZoneId.systemDefault());

    private static final BigDecimal DEFAULT_VALOR = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALOR = new BigDecimal(2);

    private static final BigDecimal DEFAULT_VALOR_DESCONTO = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALOR_DESCONTO = new BigDecimal(2);

    private static final BigDecimal DEFAULT_VALOR_ACRESCIMO = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALOR_ACRESCIMO = new BigDecimal(2);

    private static final BigDecimal DEFAULT_VALOR_PAGO = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALOR_PAGO = new BigDecimal(2);

    private static final StatusPagamento DEFAULT_STATUS = StatusPagamento.PENDENTE;
    private static final StatusPagamento UPDATED_STATUS = StatusPagamento.PAGO;

    private static final String ENTITY_API_URL = "/api/pagamentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPagamentoMockMvc;

    private Pagamento pagamento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pagamento createEntity(EntityManager em) {
        Pagamento pagamento = new Pagamento()
            .descricao(DEFAULT_DESCRICAO)
            .emissao(DEFAULT_EMISSAO)
            .vencimento(DEFAULT_VENCIMENTO)
            .valor(DEFAULT_VALOR)
            .valorDesconto(DEFAULT_VALOR_DESCONTO)
            .valorAcrescimo(DEFAULT_VALOR_ACRESCIMO)
            .valorPago(DEFAULT_VALOR_PAGO)
            .status(DEFAULT_STATUS);
        return pagamento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pagamento createUpdatedEntity(EntityManager em) {
        Pagamento pagamento = new Pagamento()
            .descricao(UPDATED_DESCRICAO)
            .emissao(UPDATED_EMISSAO)
            .vencimento(UPDATED_VENCIMENTO)
            .valor(UPDATED_VALOR)
            .valorDesconto(UPDATED_VALOR_DESCONTO)
            .valorAcrescimo(UPDATED_VALOR_ACRESCIMO)
            .valorPago(UPDATED_VALOR_PAGO)
            .status(UPDATED_STATUS);
        return pagamento;
    }

    @BeforeEach
    public void initTest() {
        pagamento = createEntity(em);
    }

    @Test
    @Transactional
    void createPagamento() throws Exception {
        int databaseSizeBeforeCreate = pagamentoRepository.findAll().size();
        // Create the Pagamento
        restPagamentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pagamento)))
            .andExpect(status().isCreated());

        // Validate the Pagamento in the database
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeCreate + 1);
        Pagamento testPagamento = pagamentoList.get(pagamentoList.size() - 1);
        assertThat(testPagamento.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testPagamento.getEmissao()).isEqualTo(DEFAULT_EMISSAO);
        assertThat(testPagamento.getVencimento()).isEqualTo(DEFAULT_VENCIMENTO);
        assertThat(testPagamento.getValor()).isEqualByComparingTo(DEFAULT_VALOR);
        assertThat(testPagamento.getValorDesconto()).isEqualByComparingTo(DEFAULT_VALOR_DESCONTO);
        assertThat(testPagamento.getValorAcrescimo()).isEqualByComparingTo(DEFAULT_VALOR_ACRESCIMO);
        assertThat(testPagamento.getValorPago()).isEqualByComparingTo(DEFAULT_VALOR_PAGO);
        assertThat(testPagamento.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createPagamentoWithExistingId() throws Exception {
        // Create the Pagamento with an existing ID
        pagamento.setId(1L);

        int databaseSizeBeforeCreate = pagamentoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPagamentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pagamento)))
            .andExpect(status().isBadRequest());

        // Validate the Pagamento in the database
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPagamentos() throws Exception {
        // Initialize the database
        pagamentoRepository.saveAndFlush(pagamento);

        // Get all the pagamentoList
        restPagamentoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pagamento.getId().intValue())))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)))
            .andExpect(jsonPath("$.[*].emissao").value(hasItem(DEFAULT_EMISSAO.toString())))
            .andExpect(jsonPath("$.[*].vencimento").value(hasItem(DEFAULT_VENCIMENTO.toString())))
            .andExpect(jsonPath("$.[*].valor").value(hasItem(sameNumber(DEFAULT_VALOR))))
            .andExpect(jsonPath("$.[*].valorDesconto").value(hasItem(sameNumber(DEFAULT_VALOR_DESCONTO))))
            .andExpect(jsonPath("$.[*].valorAcrescimo").value(hasItem(sameNumber(DEFAULT_VALOR_ACRESCIMO))))
            .andExpect(jsonPath("$.[*].valorPago").value(hasItem(sameNumber(DEFAULT_VALOR_PAGO))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getPagamento() throws Exception {
        // Initialize the database
        pagamentoRepository.saveAndFlush(pagamento);

        // Get the pagamento
        restPagamentoMockMvc
            .perform(get(ENTITY_API_URL_ID, pagamento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pagamento.getId().intValue()))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO))
            .andExpect(jsonPath("$.emissao").value(DEFAULT_EMISSAO.toString()))
            .andExpect(jsonPath("$.vencimento").value(DEFAULT_VENCIMENTO.toString()))
            .andExpect(jsonPath("$.valor").value(sameNumber(DEFAULT_VALOR)))
            .andExpect(jsonPath("$.valorDesconto").value(sameNumber(DEFAULT_VALOR_DESCONTO)))
            .andExpect(jsonPath("$.valorAcrescimo").value(sameNumber(DEFAULT_VALOR_ACRESCIMO)))
            .andExpect(jsonPath("$.valorPago").value(sameNumber(DEFAULT_VALOR_PAGO)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPagamento() throws Exception {
        // Get the pagamento
        restPagamentoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPagamento() throws Exception {
        // Initialize the database
        pagamentoRepository.saveAndFlush(pagamento);

        int databaseSizeBeforeUpdate = pagamentoRepository.findAll().size();

        // Update the pagamento
        Pagamento updatedPagamento = pagamentoRepository.findById(pagamento.getId()).get();
        // Disconnect from session so that the updates on updatedPagamento are not directly saved in db
        em.detach(updatedPagamento);
        updatedPagamento
            .descricao(UPDATED_DESCRICAO)
            .emissao(UPDATED_EMISSAO)
            .vencimento(UPDATED_VENCIMENTO)
            .valor(UPDATED_VALOR)
            .valorDesconto(UPDATED_VALOR_DESCONTO)
            .valorAcrescimo(UPDATED_VALOR_ACRESCIMO)
            .valorPago(UPDATED_VALOR_PAGO)
            .status(UPDATED_STATUS);

        restPagamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPagamento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPagamento))
            )
            .andExpect(status().isOk());

        // Validate the Pagamento in the database
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeUpdate);
        Pagamento testPagamento = pagamentoList.get(pagamentoList.size() - 1);
        assertThat(testPagamento.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testPagamento.getEmissao()).isEqualTo(UPDATED_EMISSAO);
        assertThat(testPagamento.getVencimento()).isEqualTo(UPDATED_VENCIMENTO);
        assertThat(testPagamento.getValor()).isEqualTo(UPDATED_VALOR);
        assertThat(testPagamento.getValorDesconto()).isEqualTo(UPDATED_VALOR_DESCONTO);
        assertThat(testPagamento.getValorAcrescimo()).isEqualTo(UPDATED_VALOR_ACRESCIMO);
        assertThat(testPagamento.getValorPago()).isEqualTo(UPDATED_VALOR_PAGO);
        assertThat(testPagamento.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingPagamento() throws Exception {
        int databaseSizeBeforeUpdate = pagamentoRepository.findAll().size();
        pagamento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPagamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pagamento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pagamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pagamento in the database
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPagamento() throws Exception {
        int databaseSizeBeforeUpdate = pagamentoRepository.findAll().size();
        pagamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPagamentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pagamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pagamento in the database
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPagamento() throws Exception {
        int databaseSizeBeforeUpdate = pagamentoRepository.findAll().size();
        pagamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPagamentoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pagamento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pagamento in the database
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePagamentoWithPatch() throws Exception {
        // Initialize the database
        pagamentoRepository.saveAndFlush(pagamento);

        int databaseSizeBeforeUpdate = pagamentoRepository.findAll().size();

        // Update the pagamento using partial update
        Pagamento partialUpdatedPagamento = new Pagamento();
        partialUpdatedPagamento.setId(pagamento.getId());

        partialUpdatedPagamento
            .emissao(UPDATED_EMISSAO)
            .valorDesconto(UPDATED_VALOR_DESCONTO)
            .valorAcrescimo(UPDATED_VALOR_ACRESCIMO)
            .valorPago(UPDATED_VALOR_PAGO);

        restPagamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPagamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPagamento))
            )
            .andExpect(status().isOk());

        // Validate the Pagamento in the database
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeUpdate);
        Pagamento testPagamento = pagamentoList.get(pagamentoList.size() - 1);
        assertThat(testPagamento.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testPagamento.getEmissao()).isEqualTo(UPDATED_EMISSAO);
        assertThat(testPagamento.getVencimento()).isEqualTo(DEFAULT_VENCIMENTO);
        assertThat(testPagamento.getValor()).isEqualByComparingTo(DEFAULT_VALOR);
        assertThat(testPagamento.getValorDesconto()).isEqualByComparingTo(UPDATED_VALOR_DESCONTO);
        assertThat(testPagamento.getValorAcrescimo()).isEqualByComparingTo(UPDATED_VALOR_ACRESCIMO);
        assertThat(testPagamento.getValorPago()).isEqualByComparingTo(UPDATED_VALOR_PAGO);
        assertThat(testPagamento.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdatePagamentoWithPatch() throws Exception {
        // Initialize the database
        pagamentoRepository.saveAndFlush(pagamento);

        int databaseSizeBeforeUpdate = pagamentoRepository.findAll().size();

        // Update the pagamento using partial update
        Pagamento partialUpdatedPagamento = new Pagamento();
        partialUpdatedPagamento.setId(pagamento.getId());

        partialUpdatedPagamento
            .descricao(UPDATED_DESCRICAO)
            .emissao(UPDATED_EMISSAO)
            .vencimento(UPDATED_VENCIMENTO)
            .valor(UPDATED_VALOR)
            .valorDesconto(UPDATED_VALOR_DESCONTO)
            .valorAcrescimo(UPDATED_VALOR_ACRESCIMO)
            .valorPago(UPDATED_VALOR_PAGO)
            .status(UPDATED_STATUS);

        restPagamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPagamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPagamento))
            )
            .andExpect(status().isOk());

        // Validate the Pagamento in the database
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeUpdate);
        Pagamento testPagamento = pagamentoList.get(pagamentoList.size() - 1);
        assertThat(testPagamento.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testPagamento.getEmissao()).isEqualTo(UPDATED_EMISSAO);
        assertThat(testPagamento.getVencimento()).isEqualTo(UPDATED_VENCIMENTO);
        assertThat(testPagamento.getValor()).isEqualByComparingTo(UPDATED_VALOR);
        assertThat(testPagamento.getValorDesconto()).isEqualByComparingTo(UPDATED_VALOR_DESCONTO);
        assertThat(testPagamento.getValorAcrescimo()).isEqualByComparingTo(UPDATED_VALOR_ACRESCIMO);
        assertThat(testPagamento.getValorPago()).isEqualByComparingTo(UPDATED_VALOR_PAGO);
        assertThat(testPagamento.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingPagamento() throws Exception {
        int databaseSizeBeforeUpdate = pagamentoRepository.findAll().size();
        pagamento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPagamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pagamento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pagamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pagamento in the database
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPagamento() throws Exception {
        int databaseSizeBeforeUpdate = pagamentoRepository.findAll().size();
        pagamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPagamentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pagamento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pagamento in the database
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPagamento() throws Exception {
        int databaseSizeBeforeUpdate = pagamentoRepository.findAll().size();
        pagamento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPagamentoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(pagamento))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pagamento in the database
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePagamento() throws Exception {
        // Initialize the database
        pagamentoRepository.saveAndFlush(pagamento);

        int databaseSizeBeforeDelete = pagamentoRepository.findAll().size();

        // Delete the pagamento
        restPagamentoMockMvc
            .perform(delete(ENTITY_API_URL_ID, pagamento.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pagamento> pagamentoList = pagamentoRepository.findAll();
        assertThat(pagamentoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
