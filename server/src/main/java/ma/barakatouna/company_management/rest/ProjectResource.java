package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import ma.barakatouna.company_management.entities.Project;
import ma.barakatouna.company_management.entities.ProjectStatsDTO;
import ma.barakatouna.company_management.model.MaterialDTO;
import ma.barakatouna.company_management.model.ProjectDTO;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.repos.MaterialRepository;
import ma.barakatouna.company_management.repos.ProjectRepository;
import ma.barakatouna.company_management.repos.TaskRepository;
import ma.barakatouna.company_management.service.ProjectService;
import ma.barakatouna.company_management.util.NotFoundException;
import ma.barakatouna.company_management.util.ReferencedException;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;


@RestController
@CrossOrigin ("*")
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
    public ResponseEntity<Long> createProject(@RequestParam("name") String name,
                                              @RequestParam("description") String description,
                                              @RequestParam("budget") Double budget,
                                              @RequestParam("paid") Boolean paid,
                                              @RequestParam("done") Boolean done,
                                              @RequestParam("startDate") LocalDate startDate,
                                              @RequestParam("endDate") LocalDate endDate,
                                              @RequestParam(value = "employers", required = false) Set<Long> employerIds,
                                              @RequestParam(value = "materials", required = false) Set<Long> materialIds,
                                              @RequestParam(value = "tasks", required = false) Set<Long> taskIds,
                                              @RequestParam(value = "payment", required = false) Long paymentId,
                                              @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        // Call service to create a new project
        Project project = projectService.createProject(name, description, budget, paid, done, startDate, endDate, employerIds, materialIds, taskIds, paymentId, image);

        // Return the ID of the created project with HTTP status 201 Created
        return new ResponseEntity<>(project.getId(), HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}/image", produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public byte[] getProjectImage(@PathVariable(name = "id") final Long id) throws IOException {
        Project project = projectRepository.findById(id).orElseThrow(NotFoundException::new);
        String imagePath = project.getUrl();
        return Files.readAllBytes(Path.of(URI.create(imagePath)));
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

    @GetMapping("/name/{name}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByName(@PathVariable String name) {
        List<ProjectDTO> projects =  projectService.getProjectByName(name);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countAll() {
        return ResponseEntity.ok(projectRepository.count());
    }
    @GetMapping("/stats")
    public ProjectStatsDTO getProjectStats() {
        List<Object[]> rawStats = projectRepository.findProjectCountsGroupedByStartDate();

        List<String> categories = rawStats.stream()
                .map(stat -> stat[0].toString()) // Assuming startDate is a LocalDate, adjust as necessary
                .collect(Collectors.toList());

        List<Integer> data = rawStats.stream()
                .map(stat -> ((Long) stat[1]).intValue()) // Assuming the count is returned as Long
                .collect(Collectors.toList());

        ProjectStatsDTO stats = new ProjectStatsDTO();
        stats.setCategories(categories);
        stats.setData(data);
        return stats;
    }
}
