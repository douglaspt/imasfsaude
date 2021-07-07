package br.com.imasf.domain;

import br.com.imasf.domain.enumeration.StatusPagamento;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Conta.
 */
@Entity
@Table(name = "conta")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Conta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "competencia")
    private LocalDate competencia;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusPagamento status;

    @JsonIgnoreProperties(value = { "cep", "plano" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Beneficiario beneficiario;

    @JsonIgnoreProperties(value = { "cep" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Conveniado conveniado;

    @OneToMany(mappedBy = "conta")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "conta" }, allowSetters = true)
    private Set<Procedimento> procedimentos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Conta id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getCompetencia() {
        return this.competencia;
    }

    public Conta competencia(LocalDate competencia) {
        this.competencia = competencia;
        return this;
    }

    public void setCompetencia(LocalDate competencia) {
        this.competencia = competencia;
    }

    public StatusPagamento getStatus() {
        return this.status;
    }

    public Conta status(StatusPagamento status) {
        this.status = status;
        return this;
    }

    public void setStatus(StatusPagamento status) {
        this.status = status;
    }

    public Beneficiario getBeneficiario() {
        return this.beneficiario;
    }

    public Conta beneficiario(Beneficiario beneficiario) {
        this.setBeneficiario(beneficiario);
        return this;
    }

    public void setBeneficiario(Beneficiario beneficiario) {
        this.beneficiario = beneficiario;
    }

    public Conveniado getConveniado() {
        return this.conveniado;
    }

    public Conta conveniado(Conveniado conveniado) {
        this.setConveniado(conveniado);
        return this;
    }

    public void setConveniado(Conveniado conveniado) {
        this.conveniado = conveniado;
    }

    public Set<Procedimento> getProcedimentos() {
        return this.procedimentos;
    }

    public Conta procedimentos(Set<Procedimento> procedimentos) {
        this.setProcedimentos(procedimentos);
        return this;
    }

    public Conta addProcedimento(Procedimento procedimento) {
        this.procedimentos.add(procedimento);
        procedimento.setConta(this);
        return this;
    }

    public Conta removeProcedimento(Procedimento procedimento) {
        this.procedimentos.remove(procedimento);
        procedimento.setConta(null);
        return this;
    }

    public void setProcedimentos(Set<Procedimento> procedimentos) {
        if (this.procedimentos != null) {
            this.procedimentos.forEach(i -> i.setConta(null));
        }
        if (procedimentos != null) {
            procedimentos.forEach(i -> i.setConta(this));
        }
        this.procedimentos = procedimentos;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Conta)) {
            return false;
        }
        return id != null && id.equals(((Conta) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Conta{" +
            "id=" + getId() +
            ", competencia='" + getCompetencia() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
