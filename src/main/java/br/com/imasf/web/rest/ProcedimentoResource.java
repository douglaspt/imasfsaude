package br.com.imasf.web.rest;

import br.com.imasf.domain.Procedimento;
import br.com.imasf.repository.ProcedimentoRepository;
import br.com.imasf.service.ProcedimentoService;
import br.com.imasf.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.com.imasf.domain.Procedimento}.
 */
@RestController
@RequestMapping("/api")
public class ProcedimentoResource {

    private final Logger log = LoggerFactory.getLogger(ProcedimentoResource.class);

    private static final String ENTITY_NAME = "procedimento";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProcedimentoService procedimentoService;

    private final ProcedimentoRepository procedimentoRepository;

    public ProcedimentoResource(ProcedimentoService procedimentoService, ProcedimentoRepository procedimentoRepository) {
        this.procedimentoService = procedimentoService;
        this.procedimentoRepository = procedimentoRepository;
    }

    /**
     * {@code POST  /procedimentos} : Create a new procedimento.
     *
     * @param procedimento the procedimento to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new procedimento, or with status {@code 400 (Bad Request)} if the procedimento has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/procedimentos")
    public ResponseEntity<Procedimento> createProcedimento(@RequestBody Procedimento procedimento) throws URISyntaxException {
        log.debug("REST request to save Procedimento : {}", procedimento);
        if (procedimento.getId() != null) {
            throw new BadRequestAlertException("A new procedimento cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Procedimento result = procedimentoService.save(procedimento);
        return ResponseEntity
            .created(new URI("/api/procedimentos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /procedimentos/:id} : Updates an existing procedimento.
     *
     * @param id the id of the procedimento to save.
     * @param procedimento the procedimento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated procedimento,
     * or with status {@code 400 (Bad Request)} if the procedimento is not valid,
     * or with status {@code 500 (Internal Server Error)} if the procedimento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/procedimentos/{id}")
    public ResponseEntity<Procedimento> updateProcedimento(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Procedimento procedimento
    ) throws URISyntaxException {
        log.debug("REST request to update Procedimento : {}, {}", id, procedimento);
        if (procedimento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, procedimento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!procedimentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Procedimento result = procedimentoService.save(procedimento);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, procedimento.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /procedimentos/:id} : Partial updates given fields of an existing procedimento, field will ignore if it is null
     *
     * @param id the id of the procedimento to save.
     * @param procedimento the procedimento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated procedimento,
     * or with status {@code 400 (Bad Request)} if the procedimento is not valid,
     * or with status {@code 404 (Not Found)} if the procedimento is not found,
     * or with status {@code 500 (Internal Server Error)} if the procedimento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/procedimentos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Procedimento> partialUpdateProcedimento(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Procedimento procedimento
    ) throws URISyntaxException {
        log.debug("REST request to partial update Procedimento partially : {}, {}", id, procedimento);
        if (procedimento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, procedimento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!procedimentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Procedimento> result = procedimentoService.partialUpdate(procedimento);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, procedimento.getId().toString())
        );
    }

    /**
     * {@code GET  /procedimentos} : get all the procedimentos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of procedimentos in body.
     */
    @GetMapping("/procedimentos")
    public List<Procedimento> getAllProcedimentos() {
        log.debug("REST request to get all Procedimentos");
        return procedimentoService.findAll();
    }

    /**
     * {@code GET  /procedimentos/:id} : get the "id" procedimento.
     *
     * @param id the id of the procedimento to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the procedimento, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/procedimentos/{id}")
    public ResponseEntity<Procedimento> getProcedimento(@PathVariable Long id) {
        log.debug("REST request to get Procedimento : {}", id);
        Optional<Procedimento> procedimento = procedimentoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(procedimento);
    }

    /**
     * {@code DELETE  /procedimentos/:id} : delete the "id" procedimento.
     *
     * @param id the id of the procedimento to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/procedimentos/{id}")
    public ResponseEntity<Void> deleteProcedimento(@PathVariable Long id) {
        log.debug("REST request to delete Procedimento : {}", id);
        procedimentoService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
