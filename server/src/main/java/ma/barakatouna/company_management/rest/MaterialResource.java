package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;

import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.model.MaterialDTO;
import ma.barakatouna.company_management.repos.MaterialRepository;
import ma.barakatouna.company_management.service.MaterialService;
import ma.barakatouna.company_management.util.ReferencedException;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/materials", produces = MediaType.APPLICATION_JSON_VALUE)
public class MaterialResource {

    private final MaterialService materialService;
    private final MaterialRepository materialRepository;

    public MaterialResource(final MaterialService materialService, MaterialRepository materialRepository) {
        this.materialService = materialService;
        this.materialRepository = materialRepository;
    }

    @GetMapping
    public ResponseEntity<List<MaterialDTO>> getAllMaterials() {
        return ResponseEntity.ok(materialService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialDTO> getMaterial(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(materialService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createMaterial(@RequestBody @Valid final MaterialDTO materialDTO) {
        final Long createdId = materialService.create(materialDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateMaterial(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final MaterialDTO materialDTO) {
        materialService.update(id, materialDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteMaterial(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = materialService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        materialService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{projectId}/material")
    public ResponseEntity<List<Material>> getMaterialsByProjectId(@PathVariable Long projectId) {
        List<Material> taskCount = materialRepository.findProjectMaterialsByProjectId(projectId);
        return ResponseEntity.ok(taskCount);
    }

}
