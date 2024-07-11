package ma.barakatouna.company_management.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import ma.barakatouna.company_management.model.TaskDTO;
import ma.barakatouna.company_management.service.TaskService;
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
@RequestMapping(value = "/api/tasks", produces = MediaType.APPLICATION_JSON_VALUE)
public class TaskResource {

    private final TaskService taskService;

    public TaskResource(final TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        return ResponseEntity.ok(taskService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTask(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(taskService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createTask(@RequestBody @Valid final TaskDTO taskDTO) {
        final Long createdId = taskService.create(taskDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateTask(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final TaskDTO taskDTO) {
        taskService.update(id, taskDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteTask(@PathVariable(name = "id") final Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }

//    ===========================

    @GetMapping("/projects/{projectId}/tasks/count")
    public ResponseEntity<Long> getTaskCountByProjectId(@PathVariable Long projectId) {
        long taskCount = taskService.getCountTaskByProjectId(projectId);
        return ResponseEntity.ok(taskCount);
    }

    @GetMapping("/projects/{projectId}/tasks/count-done")
    public ResponseEntity<Long> getTaskCountByProjectId_done(@PathVariable Long projectId) {
        long taskCount = taskService.getCountTaskByProjectId_done(projectId, true);
        return ResponseEntity.ok(taskCount);
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskDTO>> getTasksByProject(@PathVariable Long projectId) {
        List<TaskDTO> taskCount = taskService.getTaskByProjectId(projectId);
        return ResponseEntity.ok(taskCount);
    }



}
