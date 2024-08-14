package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import ma.barakatouna.company_management.entities.*;
import ma.barakatouna.company_management.model.MaterialDTO;
import ma.barakatouna.company_management.repos.*;
import ma.barakatouna.company_management.service.MaterialService;
import ma.barakatouna.company_management.util.ReferencedException;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@RestController
@CrossOrigin ("*")
@RequestMapping(value = "/api/materials", produces = MediaType.APPLICATION_JSON_VALUE)
public class MaterialResource {

    private final MaterialService materialService;
    private final MaterialRepository materialRepository;
    private final ProjectRepository projectRepository;
    private final EmployerRepository employerRepository;
    private final SalaryRepository salaryRepository;
    private final PaymentRepository paymentRepository;
    private final TaskRepository taskRepository;


    public MaterialResource(final MaterialService materialService, MaterialRepository materialRepository, MaterialRepository materialRepository1, ProjectRepository projectRepository, EmployerRepository employerRepository, SalaryRepository salaryRepository, PaymentRepository paymentRepository, TaskRepository taskRepository) {
        this.materialService = materialService;
        this.materialRepository = materialRepository1;
        this.projectRepository = projectRepository;
        this.employerRepository = employerRepository;
        this.salaryRepository = salaryRepository;
        this.paymentRepository = paymentRepository;
        this.taskRepository = taskRepository;
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
    public ResponseEntity<Long> createMaterial(@RequestBody @Valid MaterialDTO materialDTO) {
        Material material = new Material();
        material.setName(materialDTO.getName());
        material.setOwned(materialDTO.getOwned());
        material.setReference(materialDTO.getReference());

        // Fetch related entities
        List<Project> projects = projectRepository.findAllById(materialDTO.getProjectIds());
        List<Employer> employers = employerRepository.findAllById(materialDTO.getEmployerIds());
        List<Salary> salaries = salaryRepository.findAllById(materialDTO.getSalaryIds());
        List<Payment> payments = paymentRepository.findAllById(materialDTO.getPaymentIds());
        List<Task> tasks = taskRepository.findAllById(materialDTO.getTaskIds());

        material.setTasks(tasks);

        Long createdId = materialRepository.save(material).getId();

        // Update relationships
        projects.forEach(project -> {
            project.setMaterials(Set.of(material));
            projectRepository.save(project);
        });
        employers.forEach(employer -> {
            employer.setMaterials(Set.of(material));
            employerRepository.save(employer);
        });
        salaries.forEach(salary -> {
            salary.setMaterial(material);
            salaryRepository.save(salary);
        });
        payments.forEach(payment -> {
            payment.setMaterial(material);
            paymentRepository.save(payment);
        });

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

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<List<MaterialDTO>> getMaterialsByProjectId(@PathVariable Long projectId) {
        List<MaterialDTO> taskCount = materialService.getMaterialsByProjectId(projectId);
        return ResponseEntity.ok(taskCount);
    }

    @GetMapping("/own/{owned}")
    public ResponseEntity<List<MaterialDTO>> getMaterialsOwn(@PathVariable Boolean owned) {
        List<MaterialDTO> taskCount = materialService.getMaterialsOwn(owned);
        return ResponseEntity.ok(taskCount);
    }

    @GetMapping("/{paymentId}/payment")
    public ResponseEntity<List<MaterialDTO>> getMaterialsByPaymentId(@PathVariable Long paymentId) {
        List<MaterialDTO> taskCount = materialService.getMaterialsByPaymentId(paymentId);
        return ResponseEntity.ok(taskCount);
    }

    @GetMapping("/{taskId}/task")
    public ResponseEntity<List<MaterialDTO>> getMaterialsByTaskId(@PathVariable Long taskId) {
        List<MaterialDTO> taskCount = materialService.getMaterialsByTaskId(taskId);
        return ResponseEntity.ok(taskCount);
    }

    @GetMapping("/{salaryId}/salary")
    public ResponseEntity<List<MaterialDTO>> getMaterialsBySalaryId(@PathVariable Long salaryId) {
        List<MaterialDTO> taskCount = materialService.getMaterialsBySalaryId(salaryId);
        return ResponseEntity.ok(taskCount);
    }

    @GetMapping("/employers/{employerId}")
    public ResponseEntity<List<MaterialDTO>> getMaterialsByEmployerId(@PathVariable Long employerId) {
        List<MaterialDTO> taskCount = materialService.getMaterialsByEmployerId(employerId);
        return ResponseEntity.ok(taskCount);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<MaterialDTO> getMaterialByName(@PathVariable String name) {
        MaterialDTO taskCount = materialService.getMaterialByName(name);
        return ResponseEntity.ok(taskCount);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countAll() {
        return ResponseEntity.ok(materialService.countAll());
    }
}
