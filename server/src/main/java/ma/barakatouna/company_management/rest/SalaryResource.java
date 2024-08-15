package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Salary;
import ma.barakatouna.company_management.model.SalaryDTO;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.repos.MaterialRepository;
import ma.barakatouna.company_management.repos.SalaryRepository;
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
    private final SalaryRepository salaryRepository;
    private final MaterialRepository materialRepository;
    private final EmployerRepository employerRepository;
    public SalaryResource(final SalaryService salaryService, SalaryRepository salaryRepository, MaterialRepository materialRepository, EmployerRepository employerRepository) {
        this.salaryService = salaryService;
        this.salaryRepository = salaryRepository;
        this.materialRepository = materialRepository;
        this.employerRepository = employerRepository;
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
    public ResponseEntity<Long> createSalary(@RequestBody @Valid final SalaryDTO salaryDto) {
        // Convert SalaryDTO to Salary entity
        Salary salary = new Salary();
        salary.setAmount(salaryDto.getAmount());
        salary.setFrequency(salaryDto.getFrequency());
        salary.setPaid(salaryDto.getPaid());
        salary.setStartingDate(salaryDto.getStartingDate());
        salary.setEndingDate(salaryDto.getEndingDate());

        // Fetch related entities based on the relationships in SalaryDTO
        Employer employer = employerRepository.findById(salaryDto.getEmployers()).orElse(null);
        Material material = materialRepository.findById(salaryDto.getMaterial()).orElse(null);

        if (employer != null) {
            salary.setEmployers(employer);
        }

        if (material != null) {
            salary.setMaterial(material);
        }

        // Save the salary
        Long createdId = salaryRepository.save(salary).getId();

        // Update relationships if needed
        if (employer != null) {
            employer.getSalaries().add(salary);
            employerRepository.save(employer);
        }
        if (material != null) {
            material.getSalaries().add(salary);
            materialRepository.save(material);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdId);
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
    @GetMapping("/count")
    public ResponseEntity<Long> countAll() {
        return ResponseEntity.ok(salaryRepository.count());
    }


}
