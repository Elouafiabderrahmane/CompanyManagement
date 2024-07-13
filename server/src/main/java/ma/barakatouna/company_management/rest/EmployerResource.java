package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;

import ma.barakatouna.company_management.entities.*;
import ma.barakatouna.company_management.model.EmployerDTO;
import ma.barakatouna.company_management.service.EmployerService;
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



    @GetMapping("/{employerId}/salaries")
    public ResponseEntity<List<Salary>> getAllSalariesForEmployer(@PathVariable(name = "employerId") Long employerId) {
        List<Salary> salaries = employerService.getAllSalariesByEmployer(employerId);
        return ResponseEntity.ok(salaries);
    }
    @GetMapping("/{employerId}/tasks")
    public ResponseEntity<List<Task>> getAllTasksForEmployer(@PathVariable(name = "employerId") Long employerId) {
        List<Task> tasks = employerService.getAllTasksByEmployer(employerId);
        return ResponseEntity.ok(tasks);
    }
    @GetMapping("/{employerId}/payments")
    public ResponseEntity<List<Payment>> getAllPaymentsForEmployer(@PathVariable(name = "employerId") Long employerId) {
        List<Payment> payments = employerService.getAllPaymentsByEmployer(employerId);
        return ResponseEntity.ok(payments);
    }
    @GetMapping("/{employerId}/projects")
    public ResponseEntity<List<Project>> getAllProjectsForEmployer(@PathVariable(name = "employerId") Long employerId) {
        List<Project> projects = employerService.getAllProjectsByEmployer(employerId);
        return ResponseEntity.ok(projects);
    }
    @GetMapping("/{employerId}/materials")
    public ResponseEntity<List<Material>> getAllMaterialsForEmployer(@PathVariable Long employerId) {
        List<Material> materials = employerService.getAllMaterialsByEmployer(employerId);
        return ResponseEntity.ok(materials);
    }


}
