package br.com.imasf.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Procedimento.
 */
@Entity
@Table(name = "procedimento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Procedimento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "quantidade")
    private Integer quantidade;

    @Column(name = "valor_informado", precision = 21, scale = 2)
    private BigDecimal valorInformado;

    @Column(name = "valor_pago", precision = 21, scale = 2)
    private BigDecimal valorPago;

    @Column(name = "glosa", precision = 21, scale = 2)
    private BigDecimal glosa;

    @ManyToOne
    @JsonIgnoreProperties(value = { "beneficiario", "conveniado", "procedimentos" }, allowSetters = true)
    private Conta conta;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Procedimento id(Long id) {
        this.id = id;
        return this;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Procedimento descricao(String descricao) {
        this.descricao = descricao;
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getQuantidade() {
        return this.quantidade;
    }

    public Procedimento quantidade(Integer quantidade) {
        this.quantidade = quantidade;
        return this;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getValorInformado() {
        return this.valorInformado;
    }

    public Procedimento valorInformado(BigDecimal valorInformado) {
        this.valorInformado = valorInformado;
        return this;
    }

    public void setValorInformado(BigDecimal valorInformado) {
        this.valorInformado = valorInformado;
    }

    public BigDecimal getValorPago() {
        return this.valorPago;
    }

    public Procedimento valorPago(BigDecimal valorPago) {
        this.valorPago = valorPago;
        return this;
    }

    public void setValorPago(BigDecimal valorPago) {
        this.valorPago = valorPago;
    }

    public BigDecimal getGlosa() {
        return this.glosa;
    }

    public Procedimento glosa(BigDecimal glosa) {
        this.glosa = glosa;
        return this;
    }

    public void setGlosa(BigDecimal glosa) {
        this.glosa = glosa;
    }

    public Conta getConta() {
        return this.conta;
    }

    public Procedimento conta(Conta conta) {
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
        if (!(o instanceof Procedimento)) {
            return false;
        }
        return id != null && id.equals(((Procedimento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Procedimento{" +
            "id=" + getId() +
            ", descricao='" + getDescricao() + "'" +
            ", quantidade=" + getQuantidade() +
            ", valorInformado=" + getValorInformado() +
            ", valorPago=" + getValorPago() +
            ", glosa=" + getGlosa() +
            "}";
    }
}
