package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import ma.barakatouna.company_management.model.SalaryDTO;
import ma.barakatouna.company_management.service.SalaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin ("*")

@RequestMapping(value = "/api/salaries", produces = MediaType.APPLICATION_JSON_VALUE)
public class SalaryResource {

    private final SalaryService salaryService;

    public SalaryResource(final SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @GetMapping
    public ResponseEntity<List<SalaryDTO>> getAllSalaries() {
        return ResponseEntity.ok(salaryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaryDTO> getSalary(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(salaryService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createSalary(@RequestBody @Valid final SalaryDTO salaryDTO) {
        final Long createdId = salaryService.create(salaryDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateSalary(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final SalaryDTO salaryDTO) {
        salaryService.update(id, salaryDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteSalary(@PathVariable(name = "id") final Long id) {
        salaryService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
