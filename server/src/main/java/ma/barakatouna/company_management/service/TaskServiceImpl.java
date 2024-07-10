package ma.barakatouna.company_management.service;

import jakarta.transaction.Transactional;
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

import java.util.Collections;
import java.util.HashSet;
import java.util.List;


@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final EmployerRepository employerRepository;
    private final MaterialRepository materialRepository;

    public TaskServiceImpl(final TaskRepository taskRepository,
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
        taskDTO.setProjet(task.getProjet() == null ? null : task.getProjet().getId());
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
        final Project projet = taskDTO.getProjet() == null ? null : projectRepository.findById(taskDTO.getProjet())
                .orElseThrow(() -> new NotFoundException("projet not found"));
        task.setProjet(projet);
        final List<Employer> employer = employerRepository.findAllById(
                taskDTO.getEmployer() == null ? Collections.emptyList() : taskDTO.getEmployer());
        if (employer.size() != (taskDTO.getEmployer() == null ? 0 : taskDTO.getEmployer().size())) {
            throw new NotFoundException("one of employer not found");
        }
        task.setEmployer(new HashSet<>(employer));
        return task;
    }

}
