package br.com.imasf.web.rest;

import br.com.imasf.domain.Cep;
import br.com.imasf.repository.CepRepository;
import br.com.imasf.service.CepService;
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
 * REST controller for managing {@link br.com.imasf.domain.Cep}.
 */
@RestController
@RequestMapping("/api")
public class CepResource {

    private final Logger log = LoggerFactory.getLogger(CepResource.class);

    private static final String ENTITY_NAME = "cep";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CepService cepService;

    private final CepRepository cepRepository;

    public CepResource(CepService cepService, CepRepository cepRepository) {
        this.cepService = cepService;
        this.cepRepository = cepRepository;
    }

    /**
     * {@code POST  /ceps} : Create a new cep.
     *
     * @param cep the cep to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cep, or with status {@code 400 (Bad Request)} if the cep has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ceps")
    public ResponseEntity<Cep> createCep(@RequestBody Cep cep) throws URISyntaxException {
        log.debug("REST request to save Cep : {}", cep);
        if (cep.getId() != null) {
            throw new BadRequestAlertException("A new cep cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Cep result = cepService.save(cep);
        return ResponseEntity
            .created(new URI("/api/ceps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ceps/:id} : Updates an existing cep.
     *
     * @param id the id of the cep to save.
     * @param cep the cep to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cep,
     * or with status {@code 400 (Bad Request)} if the cep is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cep couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ceps/{id}")
    public ResponseEntity<Cep> updateCep(@PathVariable(value = "id", required = false) final Long id, @RequestBody Cep cep)
        throws URISyntaxException {
        log.debug("REST request to update Cep : {}, {}", id, cep);
        if (cep.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cep.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cepRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Cep result = cepService.save(cep);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cep.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ceps/:id} : Partial updates given fields of an existing cep, field will ignore if it is null
     *
     * @param id the id of the cep to save.
     * @param cep the cep to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cep,
     * or with status {@code 400 (Bad Request)} if the cep is not valid,
     * or with status {@code 404 (Not Found)} if the cep is not found,
     * or with status {@code 500 (Internal Server Error)} if the cep couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ceps/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Cep> partialUpdateCep(@PathVariable(value = "id", required = false) final Long id, @RequestBody Cep cep)
        throws URISyntaxException {
        log.debug("REST request to partial update Cep partially : {}, {}", id, cep);
        if (cep.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cep.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cepRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Cep> result = cepService.partialUpdate(cep);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cep.getId().toString())
        );
    }

    /**
     * {@code GET  /ceps} : get all the ceps.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ceps in body.
     */
    @GetMapping("/ceps")
    public List<Cep> getAllCeps() {
        log.debug("REST request to get all Ceps");
        return cepService.findAll();
    }

    /**
     * {@code GET  /ceps/:id} : get the "id" cep.
     *
     * @param id the id of the cep to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cep, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ceps/{id}")
    public ResponseEntity<Cep> getCep(@PathVariable Long id) {
        log.debug("REST request to get Cep : {}", id);
        Optional<Cep> cep = cepService.findOne(id);
        return ResponseUtil.wrapOrNotFound(cep);
    }

    /**
     * {@code DELETE  /ceps/:id} : delete the "id" cep.
     *
     * @param id the id of the cep to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ceps/{id}")
    public ResponseEntity<Void> deleteCep(@PathVariable Long id) {
        log.debug("REST request to delete Cep : {}", id);
        cepService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
