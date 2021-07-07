package br.com.imasf.web.rest;

import br.com.imasf.domain.Plano;
import br.com.imasf.repository.PlanoRepository;
import br.com.imasf.service.PlanoService;
import br.com.imasf.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.com.imasf.domain.Plano}.
 */
@RestController
@RequestMapping("/api")
public class PlanoResource {

    private final Logger log = LoggerFactory.getLogger(PlanoResource.class);

    private static final String ENTITY_NAME = "plano";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlanoService planoService;

    private final PlanoRepository planoRepository;

    public PlanoResource(PlanoService planoService, PlanoRepository planoRepository) {
        this.planoService = planoService;
        this.planoRepository = planoRepository;
    }

    /**
     * {@code POST  /planos} : Create a new plano.
     *
     * @param plano the plano to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new plano, or with status {@code 400 (Bad Request)} if the plano has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/planos")
    public ResponseEntity<Plano> createPlano(@RequestBody Plano plano) throws URISyntaxException {
        log.debug("REST request to save Plano : {}", plano);
        if (plano.getId() != null) {
            throw new BadRequestAlertException("A new plano cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Plano result = planoService.save(plano);
        return ResponseEntity
            .created(new URI("/api/planos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /planos/:id} : Updates an existing plano.
     *
     * @param id the id of the plano to save.
     * @param plano the plano to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plano,
     * or with status {@code 400 (Bad Request)} if the plano is not valid,
     * or with status {@code 500 (Internal Server Error)} if the plano couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/planos/{id}")
    public ResponseEntity<Plano> updatePlano(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plano plano)
        throws URISyntaxException {
        log.debug("REST request to update Plano : {}, {}", id, plano);
        if (plano.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plano.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!planoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Plano result = planoService.save(plano);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plano.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /planos/:id} : Partial updates given fields of an existing plano, field will ignore if it is null
     *
     * @param id the id of the plano to save.
     * @param plano the plano to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plano,
     * or with status {@code 400 (Bad Request)} if the plano is not valid,
     * or with status {@code 404 (Not Found)} if the plano is not found,
     * or with status {@code 500 (Internal Server Error)} if the plano couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/planos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Plano> partialUpdatePlano(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plano plano)
        throws URISyntaxException {
        log.debug("REST request to partial update Plano partially : {}, {}", id, plano);
        if (plano.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plano.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!planoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Plano> result = planoService.partialUpdate(plano);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plano.getId().toString())
        );
    }

    /**
     * {@code GET  /planos} : get all the planos.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of planos in body.
     */
    @GetMapping("/planos")
    public ResponseEntity<List<Plano>> getAllPlanos(Pageable pageable) {
        log.debug("REST request to get a page of Planos");
        Page<Plano> page = planoService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /planos/:id} : get the "id" plano.
     *
     * @param id the id of the plano to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the plano, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/planos/{id}")
    public ResponseEntity<Plano> getPlano(@PathVariable Long id) {
        log.debug("REST request to get Plano : {}", id);
        Optional<Plano> plano = planoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(plano);
    }

    /**
     * {@code DELETE  /planos/:id} : delete the "id" plano.
     *
     * @param id the id of the plano to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/planos/{id}")
    public ResponseEntity<Void> deletePlano(@PathVariable Long id) {
        log.debug("REST request to delete Plano : {}", id);
        planoService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
