package ma.barakatouna.company_management.service;

import jakarta.transaction.Transactional;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Project;
import ma.barakatouna.company_management.entities.Task;
import ma.barakatouna.company_management.model.TaskDTO;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.repos.MaterialRepository;
import ma.barakatouna.company_management.repos.ProjectRepository;
import ma.barakatouna.company_management.repos.TaskRepository;
import ma.barakatouna.company_management.util.NotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final EmployerRepository employerRepository;
    private final MaterialRepository materialRepository;

    public TaskService(final TaskRepository taskRepository,
            final ProjectRepository projectRepository, final EmployerRepository employerRepository,
            final MaterialRepository materialRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.employerRepository = employerRepository;
        this.materialRepository = materialRepository;
    }

    public List<TaskDTO> findAll() {
        final List<Task> tasks = taskRepository.findAll(Sort.by("id"));
        return tasks.stream()
                .map(task -> mapToDTO(task, new TaskDTO()))
                .toList();
    }

    public TaskDTO get(final Long id) {
        return taskRepository.findById(id)
                .map(task -> mapToDTO(task, new TaskDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final TaskDTO taskDTO) {
        final Task task = new Task();
        mapToEntity(taskDTO, task);
        return taskRepository.save(task).getId();
    }

    public void update(final Long id, final TaskDTO taskDTO) {
        final Task task = taskRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(taskDTO, task);
        taskRepository.save(task);
    }

    public void delete(final Long id) {
        final Task task = taskRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        // remove many-to-many relations at owning side
        materialRepository.findAllByTasks(task)
                .forEach(material -> material.getTasks().remove(task));
        taskRepository.delete(task);
    }

    private TaskDTO mapToDTO(final Task task, final TaskDTO taskDTO) {
        taskDTO.setId(task.getId());
        taskDTO.setTasktype(task.getTasktype());
        taskDTO.setDone(task.getDone());
        taskDTO.setTitle(task.getTitle());
        taskDTO.setDescription(task.getDescription());
        taskDTO.setStartingDate(task.getStartingDate());
        taskDTO.setEndingDate(task.getEndingDate());
        taskDTO.setProject(task.getProject() == null ? null : task.getProject().getId());
        taskDTO.setEmployer(task.getEmployer().stream()
                .map(employer -> employer.getId())
                .toList());
        return taskDTO;
    }

    private Task mapToEntity(final TaskDTO taskDTO, final Task task) {
        task.setTasktype(taskDTO.getTasktype());
        task.setDone(taskDTO.getDone());
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStartingDate(taskDTO.getStartingDate());
        task.setEndingDate(taskDTO.getEndingDate());
        final Project project = taskDTO.getProject() == null ? null : projectRepository.findById(taskDTO.getProject())
                .orElseThrow(() -> new NotFoundException("project not found"));
        task.setProject(project);
        final List<Employer> employer = employerRepository.findAllById(
                taskDTO.getEmployer() == null ? Collections.emptyList() : taskDTO.getEmployer());
        if (employer.size() != (taskDTO.getEmployer() == null ? 0 : taskDTO.getEmployer().size())) {
            throw new NotFoundException("one of employer not found");
        }
        task.setEmployer(new HashSet<>(employer));
        return task;
    }

    public long getCountTaskByProjectId(long id) {
        return taskRepository.countTasksByProjectId(id);
    }

    public long getCountTaskByProjectId_done(long id, boolean done) {
        done = true;
        return taskRepository.countTasksByProjectIdAndDone(id, done);
    }

    public List<TaskDTO> getTaskByProjectId(long id) {
        return taskRepository.findByProjectId(id).stream()
                .map(task -> mapToDTO(task, new TaskDTO()))
                .toList();
    }

    public List<TaskDTO> getTaskByTitle(String title) {
        List< Task> tasks = taskRepository.findAllByTitleContaining(title);
        return tasks.stream()
                .map(task -> mapToDTO(task, new TaskDTO()))
                .toList();

    }
}
