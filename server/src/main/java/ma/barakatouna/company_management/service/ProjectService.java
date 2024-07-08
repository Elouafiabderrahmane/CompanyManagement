package ma.barakatouna.company_management.service;

import jakarta.transaction.Transactional;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Payment;
import ma.barakatouna.company_management.entities.Project;
import ma.barakatouna.company_management.entities.Task;
import ma.barakatouna.company_management.model.ProjectDTO;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.repos.MaterialRepository;
import ma.barakatouna.company_management.repos.PaymentRepository;
import ma.barakatouna.company_management.repos.ProjectRepository;
import ma.barakatouna.company_management.repos.TaskRepository;
import ma.barakatouna.company_management.util.NotFoundException;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final EmployerRepository employerRepository;
    private final MaterialRepository materialRepository;
    private final TaskRepository taskRepository;
    private final PaymentRepository paymentRepository;

    public ProjectService(final ProjectRepository projectRepository,
            final EmployerRepository employerRepository,
            final MaterialRepository materialRepository, final TaskRepository taskRepository,
            final PaymentRepository paymentRepository) {
        this.projectRepository = projectRepository;
        this.employerRepository = employerRepository;
        this.materialRepository = materialRepository;
        this.taskRepository = taskRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<ProjectDTO> findAll() {
        final List<Project> projects = projectRepository.findAll(Sort.by("id"));
        return projects.stream()
                .map(project -> mapToDTO(project, new ProjectDTO()))
                .toList();
    }

    public ProjectDTO get(final Long id) {
        return projectRepository.findById(id)
                .map(project -> mapToDTO(project, new ProjectDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ProjectDTO projectDTO) {
        final Project project = new Project();
        mapToEntity(projectDTO, project);
        return projectRepository.save(project).getId();
    }

    public void update(final Long id, final ProjectDTO projectDTO) {
        final Project project = projectRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(projectDTO, project);
        projectRepository.save(project);
    }

    public void delete(final Long id) {
        projectRepository.deleteById(id);
    }

    private ProjectDTO mapToDTO(final Project project, final ProjectDTO projectDTO) {
        projectDTO.setId(project.getId());
        projectDTO.setName(project.getName());
        projectDTO.setDescription(project.getDescription());
        projectDTO.setBudget(project.getBudget());
        projectDTO.setPaid(project.getPaid());
        projectDTO.setDone(project.getDone());
        projectDTO.setStartDate(project.getStartDate());
        projectDTO.setEndDate(project.getEndDate());
        projectDTO.setUrl(project.getUrl());
        projectDTO.setEmployers(project.getEmployers().stream()
                .map(employer -> employer.getId())
                .toList());
        projectDTO.setMaterials(project.getMaterials().stream()
                .map(material -> material.getId())
                .toList());
        return projectDTO;
    }

    private Project mapToEntity(final ProjectDTO projectDTO, final Project project) {
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        project.setBudget(projectDTO.getBudget());
        project.setPaid(projectDTO.getPaid());
        project.setDone(projectDTO.getDone());
        project.setStartDate(projectDTO.getStartDate());
        project.setEndDate(projectDTO.getEndDate());
        project.setUrl(projectDTO.getUrl());
        final List<Employer> employers = employerRepository.findAllById(
                projectDTO.getEmployers() == null ? Collections.emptyList() : projectDTO.getEmployers());
        if (employers.size() != (projectDTO.getEmployers() == null ? 0 : projectDTO.getEmployers().size())) {
            throw new NotFoundException("one of employers not found");
        }
        project.setEmployers(new HashSet<>(employers));
        final List<Material> materials = materialRepository.findAllById(
                projectDTO.getMaterials() == null ? Collections.emptyList() : projectDTO.getMaterials());
        if (materials.size() != (projectDTO.getMaterials() == null ? 0 : projectDTO.getMaterials().size())) {
            throw new NotFoundException("one of materials not found");
        }
        project.setMaterials(new HashSet<>(materials));
        return project;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Project project = projectRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Task projetTask = taskRepository.findFirstByProjet(project);
        if (projetTask != null) {
            referencedWarning.setKey("project.task.projet.referenced");
            referencedWarning.addParam(projetTask.getId());
            return referencedWarning;
        }
        final Payment projetPayment = paymentRepository.findFirstByProjet(project);
        if (projetPayment != null) {
            referencedWarning.setKey("project.payment.projet.referenced");
            referencedWarning.addParam(projetPayment.getId());
            return referencedWarning;
        }
        return null;
    }

}
