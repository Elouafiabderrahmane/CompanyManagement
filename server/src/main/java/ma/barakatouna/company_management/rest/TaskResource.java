package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Project;
import ma.barakatouna.company_management.entities.Task;
import ma.barakatouna.company_management.model.TaskDTO;
import ma.barakatouna.company_management.repos.*;
import ma.barakatouna.company_management.service.MaterialService;
import ma.barakatouna.company_management.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@CrossOrigin ("*")
@RequestMapping(value = "/api/tasks", produces = MediaType.APPLICATION_JSON_VALUE)
public class TaskResource {

    private final TaskService taskService;
    private final MaterialService materialService;
    private final MaterialRepository materialRepository;
    private final ProjectRepository projectRepository;
    private final EmployerRepository employerRepository;
    private final SalaryRepository salaryRepository;
    private final PaymentRepository paymentRepository;
    private final TaskRepository taskRepository;
    public TaskResource(TaskService taskService, MaterialService materialService, MaterialRepository materialRepository, ProjectRepository projectRepository, EmployerRepository employerRepository, SalaryRepository salaryRepository, PaymentRepository paymentRepository, TaskRepository taskRepository) {
        this.taskService = taskService;
        this.materialService = materialService;
        this.materialRepository = materialRepository;
        this.projectRepository = projectRepository;
        this.employerRepository = employerRepository;
        this.salaryRepository = salaryRepository;
        this.paymentRepository = paymentRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        List<TaskDTO> tasks = taskService.findAll();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTask(@PathVariable Long id) {
        TaskDTO task = taskService.get(id);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createTask(@RequestBody @Valid Task task) {
        // Fetch related entities based on the relationships in Task
        Project project = projectRepository.findById(task.getProject().getId()).orElse(null);
        List<Employer> employers = employerRepository.findAllById(
                task.getEmployer().stream().map(Employer::getId).collect(Collectors.toSet()));
        List<Material> materials = materialRepository.findAllById(
                task.getMaterials().stream().map(Material::getId).collect(Collectors.toSet()));

        if (project != null) {
            task.setProject(project);
        }

        task.setEmployer(employers);
        task.setMaterials(materials);

        // Save the task
        Long createdId = taskRepository.save(task).getId();

        // Update relationships if needed
        if (project != null) {
            project.getTasks().add(task);
            projectRepository.save(project);
        }
        employers.forEach(employer -> {
            employer.getTasks().add(task);
            employerRepository.save(employer);
        });
        materials.forEach(material -> {
            material.getTasks().add(task);
            materialRepository.save(material);
        });
        return ResponseEntity.status(HttpStatus.CREATED).body(createdId);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Void> updateTask(@PathVariable Long id, @RequestBody @Valid TaskDTO taskDTO) {
        taskService.update(id, taskDTO);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/projects/{projectId}/count")
    public ResponseEntity<Long> getTaskCountByProjectId(@PathVariable Long projectId) {
        Long taskCount = taskService.getCountTaskByProjectId(projectId);
        return ResponseEntity.ok(taskCount);
    }

    @GetMapping("/projects/{projectId}/count-done")
    public ResponseEntity<Long> getCompletedTaskCountByProjectId(@PathVariable Long projectId) {
        Long completedTaskCount = taskService.getCountTaskByProjectId_done(projectId, true);
        return ResponseEntity.ok(completedTaskCount);
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<List<TaskDTO>> getTasksByProject(@PathVariable Long projectId) {
        List<TaskDTO> tasks = taskService.getTaskByProjectId(projectId);
        return ResponseEntity.ok(tasks);
    }
    @GetMapping("/employers/{employerId}")
    public ResponseEntity<List<TaskDTO>> getTasksByEmployer(@PathVariable Long employerId) {
        List<TaskDTO> tasks = taskService.getTaskByEmployerId(employerId);
        return ResponseEntity.ok(tasks);
    }


    @GetMapping("/keyword/{keyword}")
    public ResponseEntity<List<TaskDTO>> getTasksByTitle(@PathVariable String keyword) {
        List<TaskDTO> tasks = taskService.getTaskByTitle(keyword);
        return ResponseEntity.ok(tasks);
    }
}
