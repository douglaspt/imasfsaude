package br.com.imasf.web.rest;

import br.com.imasf.domain.Beneficiario;
import br.com.imasf.repository.BeneficiarioRepository;
import br.com.imasf.service.BeneficiarioService;
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
 * REST controller for managing {@link br.com.imasf.domain.Beneficiario}.
 */
@RestController
@RequestMapping("/api")
public class BeneficiarioResource {

    private final Logger log = LoggerFactory.getLogger(BeneficiarioResource.class);

    private static final String ENTITY_NAME = "beneficiario";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BeneficiarioService beneficiarioService;

    private final BeneficiarioRepository beneficiarioRepository;

    public BeneficiarioResource(BeneficiarioService beneficiarioService, BeneficiarioRepository beneficiarioRepository) {
        this.beneficiarioService = beneficiarioService;
        this.beneficiarioRepository = beneficiarioRepository;
    }

    /**
     * {@code POST  /beneficiarios} : Create a new beneficiario.
     *
     * @param beneficiario the beneficiario to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new beneficiario, or with status {@code 400 (Bad Request)} if the beneficiario has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/beneficiarios")
    public ResponseEntity<Beneficiario> createBeneficiario(@RequestBody Beneficiario beneficiario) throws URISyntaxException {
        log.debug("REST request to save Beneficiario : {}", beneficiario);
        if (beneficiario.getId() != null) {
            throw new BadRequestAlertException("A new beneficiario cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Beneficiario result = beneficiarioService.save(beneficiario);
        return ResponseEntity
            .created(new URI("/api/beneficiarios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /beneficiarios/:id} : Updates an existing beneficiario.
     *
     * @param id the id of the beneficiario to save.
     * @param beneficiario the beneficiario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated beneficiario,
     * or with status {@code 400 (Bad Request)} if the beneficiario is not valid,
     * or with status {@code 500 (Internal Server Error)} if the beneficiario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/beneficiarios/{id}")
    public ResponseEntity<Beneficiario> updateBeneficiario(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Beneficiario beneficiario
    ) throws URISyntaxException {
        log.debug("REST request to update Beneficiario : {}, {}", id, beneficiario);
        if (beneficiario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, beneficiario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!beneficiarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Beneficiario result = beneficiarioService.save(beneficiario);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, beneficiario.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /beneficiarios/:id} : Partial updates given fields of an existing beneficiario, field will ignore if it is null
     *
     * @param id the id of the beneficiario to save.
     * @param beneficiario the beneficiario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated beneficiario,
     * or with status {@code 400 (Bad Request)} if the beneficiario is not valid,
     * or with status {@code 404 (Not Found)} if the beneficiario is not found,
     * or with status {@code 500 (Internal Server Error)} if the beneficiario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/beneficiarios/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Beneficiario> partialUpdateBeneficiario(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Beneficiario beneficiario
    ) throws URISyntaxException {
        log.debug("REST request to partial update Beneficiario partially : {}, {}", id, beneficiario);
        if (beneficiario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, beneficiario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!beneficiarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Beneficiario> result = beneficiarioService.partialUpdate(beneficiario);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, beneficiario.getId().toString())
        );
    }

    /**
     * {@code GET  /beneficiarios} : get all the beneficiarios.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of beneficiarios in body.
     */
    @GetMapping("/beneficiarios")
    public ResponseEntity<List<Beneficiario>> getAllBeneficiarios(Pageable pageable) {
        log.debug("REST request to get a page of Beneficiarios");
        Page<Beneficiario> page = beneficiarioService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /beneficiarios/:id} : get the "id" beneficiario.
     *
     * @param id the id of the beneficiario to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the beneficiario, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/beneficiarios/{id}")
    public ResponseEntity<Beneficiario> getBeneficiario(@PathVariable Long id) {
        log.debug("REST request to get Beneficiario : {}", id);
        Optional<Beneficiario> beneficiario = beneficiarioService.findOne(id);
        return ResponseUtil.wrapOrNotFound(beneficiario);
    }

    /**
     * {@code DELETE  /beneficiarios/:id} : delete the "id" beneficiario.
     *
     * @param id the id of the beneficiario to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/beneficiarios/{id}")
    public ResponseEntity<Void> deleteBeneficiario(@PathVariable Long id) {
        log.debug("REST request to delete Beneficiario : {}", id);
        beneficiarioService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
