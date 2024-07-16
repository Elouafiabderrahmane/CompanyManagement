package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import ma.barakatouna.company_management.model.TaskDTO;
import ma.barakatouna.company_management.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin ("*")
@RequestMapping(value = "/api/tasks", produces = MediaType.APPLICATION_JSON_VALUE)
public class TaskResource {

    private final TaskService taskService;

    public TaskResource(TaskService taskService) {
        this.taskService = taskService;
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
    public ResponseEntity<Long> createTask(@RequestBody @Valid TaskDTO taskDTO) {
        Long createdId = taskService.create(taskDTO);
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
}
