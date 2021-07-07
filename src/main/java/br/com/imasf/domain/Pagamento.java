package br.com.imasf.domain;

import br.com.imasf.domain.enumeration.StatusPagamento;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pagamento.
 */
@Entity
@Table(name = "pagamento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pagamento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "emissao")
    private LocalDate emissao;

    @Column(name = "vencimento")
    private LocalDate vencimento;

    @Column(name = "valor", precision = 21, scale = 2)
    private BigDecimal valor;

    @Column(name = "valor_desconto", precision = 21, scale = 2)
    private BigDecimal valorDesconto;

    @Column(name = "valor_acrescimo", precision = 21, scale = 2)
    private BigDecimal valorAcrescimo;

    @Column(name = "valor_pago", precision = 21, scale = 2)
    private BigDecimal valorPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusPagamento status;

    @JsonIgnoreProperties(value = { "beneficiario", "conveniado", "procedimentos" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Conta conta;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pagamento id(Long id) {
        this.id = id;
        return this;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Pagamento descricao(String descricao) {
        this.descricao = descricao;
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDate getEmissao() {
        return this.emissao;
    }

    public Pagamento emissao(LocalDate emissao) {
        this.emissao = emissao;
        return this;
    }

    public void setEmissao(LocalDate emissao) {
        this.emissao = emissao;
    }

    public LocalDate getVencimento() {
        return this.vencimento;
    }

    public Pagamento vencimento(LocalDate vencimento) {
        this.vencimento = vencimento;
        return this;
    }

    public void setVencimento(LocalDate vencimento) {
        this.vencimento = vencimento;
    }

    public BigDecimal getValor() {
        return this.valor;
    }

    public Pagamento valor(BigDecimal valor) {
        this.valor = valor;
        return this;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public BigDecimal getValorDesconto() {
        return this.valorDesconto;
    }

    public Pagamento valorDesconto(BigDecimal valorDesconto) {
        this.valorDesconto = valorDesconto;
        return this;
    }

    public void setValorDesconto(BigDecimal valorDesconto) {
        this.valorDesconto = valorDesconto;
    }

    public BigDecimal getValorAcrescimo() {
        return this.valorAcrescimo;
    }

    public Pagamento valorAcrescimo(BigDecimal valorAcrescimo) {
        this.valorAcrescimo = valorAcrescimo;
        return this;
    }

    public void setValorAcrescimo(BigDecimal valorAcrescimo) {
        this.valorAcrescimo = valorAcrescimo;
    }

    public BigDecimal getValorPago() {
        return this.valorPago;
    }

    public Pagamento valorPago(BigDecimal valorPago) {
        this.valorPago = valorPago;
        return this;
    }

    public void setValorPago(BigDecimal valorPago) {
        this.valorPago = valorPago;
    }

    public StatusPagamento getStatus() {
        return this.status;
    }

    public Pagamento status(StatusPagamento status) {
        this.status = status;
        return this;
    }

    public void setStatus(StatusPagamento status) {
        this.status = status;
    }

    public Conta getConta() {
        return this.conta;
    }

    public Pagamento conta(Conta conta) {
        this.setConta(conta);
        return this;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pagamento)) {
            return false;
        }
        return id != null && id.equals(((Pagamento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pagamento{" +
            "id=" + getId() +
            ", descricao='" + getDescricao() + "'" +
            ", emissao='" + getEmissao() + "'" +
            ", vencimento='" + getVencimento() + "'" +
            ", valor=" + getValor() +
            ", valorDesconto=" + getValorDesconto() +
            ", valorAcrescimo=" + getValorAcrescimo() +
            ", valorPago=" + getValorPago() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
