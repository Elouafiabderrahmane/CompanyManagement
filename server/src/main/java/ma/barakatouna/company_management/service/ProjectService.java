package ma.barakatouna.company_management.service;

import jakarta.transaction.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;

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
import org.springframework.web.multipart.MultipartFile;


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
    @Transactional
    public Project createProject(String name,
                                 String description,
                                 Double budget,
                                 Boolean paid,
                                 Boolean done,
                                 LocalDate startDate,
                                 LocalDate endDate,
                                 Set<Long> employerIds,
                                 Set<Long> materialIds,
                                 Set<Long> taskIds,
                                 Long paymentId,
                                 MultipartFile image) throws IOException {

        // Map request parameters to Project entity
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setBudget(budget);
        project.setPaid(paid);
        project.setDone(done);
        project.setStartDate(startDate);
        project.setEndDate(endDate);

        // Handle Employers
        if (employerIds != null && !employerIds.isEmpty()) {
            Set<Employer> employers = new HashSet<>(employerRepository.findAllById(employerIds));
            project.setEmployers(employers);
        }

        // Handle Materials
        if (materialIds != null && !materialIds.isEmpty()) {
            Set<Material> materials = new HashSet<>(materialRepository.findAllById(materialIds));
            project.setMaterials(materials);
        }

        // Handle Tasks
        if (taskIds != null && !taskIds.isEmpty()) {
            Set<Task> tasks = new HashSet<>(taskRepository.findAllById(taskIds));
            project.setTasks(tasks);
        }

        // Handle Payment
        if (paymentId != null) {
            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));
            project.setPayment(payment);
        }

        // Handle file upload
        if (image != null && !image.isEmpty()) {
            Path path = Paths.get(System.getProperty("user.home"), "Company-Management", "projects-images");
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            // Generate unique image name
            String imageId = UUID.randomUUID().toString();
            String imageName = imageId + "-" + image.getOriginalFilename();
            Path imagePath = Paths.get(System.getProperty("user.home"), "Company-Management", "projects-images", imageName);

            // Save the image to the specified directory
            Files.copy(image.getInputStream(), imagePath);

            // Set image URL in project
            project.setUrl(imagePath.toUri().toString());
        }

        // Save the project
        return projectRepository.save(project);
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
        final Task projectTask = taskRepository.findFirstByProject(project);
        if (projectTask != null) {
            referencedWarning.setKey("project.task.project.referenced");
            referencedWarning.addParam(projectTask.getId());
            return referencedWarning;
        }
        final Payment projectPayment = paymentRepository.findFirstByProject(project);
        if (projectPayment != null) {
            referencedWarning.setKey("project.payment.project.referenced");
            referencedWarning.addParam(projectPayment.getId());
            return referencedWarning;
        }
        return null;
    }

//    ==========================================
    public List<ProjectDTO> getProjectsByMaterialId(Long materialID) {
        Material material =  materialRepository.findById(materialID).orElseThrow(NotFoundException::new) ;
        List <Project> projects= projectRepository.findAllByMaterials(material);
        return projects.stream()
                .map(project -> mapToDTO(project, new ProjectDTO()))
                .toList();
    }

    public List<ProjectDTO> getProjectsByEmployerId(Long employerId) {
        Employer employer = employerRepository.findById(employerId).orElseThrow(NotFoundException::new);
        List<Project> projects = projectRepository.findAllByEmployers(employer);
        return projects.stream()
                .map(project -> mapToDTO(project, new ProjectDTO()))
                .toList();
    }

    public List<ProjectDTO> getProjectsByTaskId(Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow(NotFoundException::new);
        List<Project> projects = projectRepository.findAllByTasks(task);
        return projects.stream()
                .map(project -> mapToDTO(project, new ProjectDTO()))
                .toList();
    }

    public List<ProjectDTO> getProjectByName(String name) {
        List<Project> projects = projectRepository.findAllByNameContaining(name);

        return projects.stream()
                .map(project -> mapToDTO(project, new ProjectDTO()))
                .toList();
    }

}
