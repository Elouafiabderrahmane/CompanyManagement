package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import ma.barakatouna.company_management.model.EmployerDTO;
import ma.barakatouna.company_management.service.EmployerService;
import ma.barakatouna.company_management.util.ReferencedException;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(value = "/api/employers", produces = MediaType.APPLICATION_JSON_VALUE)
public class EmployerResource {

    private final EmployerService employerService;

    public EmployerResource(final EmployerService employerService) {
        this.employerService = employerService;
    }

    @GetMapping
    public ResponseEntity<List<EmployerDTO>> getAllEmployers() {
        return ResponseEntity.ok(employerService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployerDTO> getEmployer(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(employerService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createEmployer(@RequestBody @Valid final EmployerDTO employerDTO) {
        final Long createdId = employerService.create(employerDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateEmployer(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final EmployerDTO employerDTO) {
        employerService.update(id, employerDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteEmployer(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = employerService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        employerService.delete(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/salaries/{salaryId}")
    public ResponseEntity<EmployerDTO> getEmployerBySalaryId(@PathVariable Long salaryId) {
        EmployerDTO employer = employerService.getEmployerBySalaryId(salaryId);
        return ResponseEntity.ok(employer);
    }
    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<List<EmployerDTO>> getEmployersByTaskId(@PathVariable Long taskId) {
        List<EmployerDTO> employers = employerService.getEmployersByTaskId(taskId);
        return ResponseEntity.ok(employers);
    }

    @GetMapping("/payments/{paymentId}")
    public ResponseEntity<EmployerDTO> getEmployerByPaymentId(@PathVariable Long paymentId) {
        EmployerDTO employer = employerService.getEmployerByPaymentId(paymentId);
        return ResponseEntity.ok(employer);
    }

    @GetMapping("/materials/{materialId}")
    public ResponseEntity<List<EmployerDTO>> getAllMaterialsForEmployer(@PathVariable Long materialId) {
        List<EmployerDTO> employers = employerService.getAllEmployersByMaterial(materialId);
        return ResponseEntity.ok(employers);
    }


    @GetMapping("/projects/{projectId}")
    public ResponseEntity<List<EmployerDTO>> getAllEmployersByProjectId(@PathVariable Long projectId) {
        List<EmployerDTO> employers = employerService.findAllByProjectId(projectId);
        return ResponseEntity.ok(employers);
    }
}
