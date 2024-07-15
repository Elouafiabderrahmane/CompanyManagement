package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import ma.barakatouna.company_management.model.ProjectDTO;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.repos.MaterialRepository;
import ma.barakatouna.company_management.repos.ProjectRepository;
import ma.barakatouna.company_management.repos.TaskRepository;
import ma.barakatouna.company_management.service.ProjectService;
import ma.barakatouna.company_management.util.ReferencedException;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(value = "/api/projects", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProjectResource {

    private final ProjectService projectService;
    private final ProjectRepository projectRepository;
    private final MaterialRepository materialRepository;
    private final EmployerRepository employerRepository;
    private final TaskRepository taskRepository;


    public ProjectResource(final ProjectService projectService, ProjectRepository projectRepository, MaterialRepository materialRepository, EmployerRepository employerRepository, TaskRepository taskRepository) {
        this.projectService = projectService;
        this.projectRepository = projectRepository;
        this.materialRepository = materialRepository;
        this.employerRepository = employerRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(projectService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createProject(@RequestBody @Valid final ProjectDTO projectDTO) {
        final Long createdId = projectService.create(projectDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateProject(@PathVariable(name = "id") final Long id,
                                              @RequestBody @Valid final ProjectDTO projectDTO) {
        projectService.update(id, projectDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteProject(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = projectService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/materials/{materialId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByMaterialId22(@PathVariable Long materialId) {
        List<ProjectDTO> projects = projectService.getProjectsByMaterialId(materialId);
        return ResponseEntity.ok(projects);
    }


    @GetMapping("/employers/{employerId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByEmployerId(@PathVariable Long employerId) {
        List<ProjectDTO> projects = projectService.getProjectsByEmployerId(employerId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByTaskId(@PathVariable Long taskId) {
        List<ProjectDTO> projects = projectService.getProjectsByTaskId(taskId);
        return ResponseEntity.ok(projects);
    }


}
