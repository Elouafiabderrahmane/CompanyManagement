package ma.barakatouna.company_management.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import ma.barakatouna.company_management.entities.*;
import ma.barakatouna.company_management.model.EmployerDTO;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.repos.MaterialRepository;
import ma.barakatouna.company_management.repos.PaymentRepository;
import ma.barakatouna.company_management.repos.ProjectRepository;
import ma.barakatouna.company_management.repos.SalaryRepository;
import ma.barakatouna.company_management.repos.TaskRepository;
import ma.barakatouna.company_management.repos.UserRepository;
import ma.barakatouna.company_management.util.NotFoundException;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;


@Service
@Transactional
public class EmployerService {

    private final EmployerRepository employerRepository;
    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final SalaryRepository salaryRepository;
    private final PaymentRepository paymentRepository;

    public EmployerService(final EmployerRepository employerRepository,
            final MaterialRepository materialRepository, final UserRepository userRepository,
            final ProjectRepository projectRepository, final TaskRepository taskRepository,
            final SalaryRepository salaryRepository, final PaymentRepository paymentRepository) {
        this.employerRepository = employerRepository;
        this.materialRepository = materialRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.salaryRepository = salaryRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<EmployerDTO> findAll() {
        final List<Employer> employers = employerRepository.findAll(Sort.by("id"));
        return employers.stream()
                .map(employer -> mapToDTO(employer, new EmployerDTO()))
                .toList();
    }

    public EmployerDTO get(final Long id) {
        return employerRepository.findById(id)
                .map(employer -> mapToDTO(employer, new EmployerDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Employer createEmployer(String name, String phone, String cin, String email, String address, LocalDate hireDate, LocalDate birthDate,
                                   Set<Long> projectIds, Set<Long> taskIds, Set<Long> materialIds, Set<Long> salaryIds, Set<Long> paymentIds, Long userId, MultipartFile image) throws IOException, IOException {

        Employer employer = new Employer();
        employer.setName(name);
        employer.setPhone(phone);
        employer.setCin(cin);
        employer.setEmail(email);
        employer.setAdress(address);
        employer.setHireDate(hireDate);
        employer.setBirthDate(birthDate);

        // Handle image upload
        if (image != null && !image.isEmpty()) {
            Path path = Paths.get(System.getProperty("user.home"), "Company-Management", "employer-images");
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            // Generate unique image name
            String imageId = UUID.randomUUID().toString();
            String imageName = imageId + "-" + image.getOriginalFilename();
            Path imagePath = Paths.get(System.getProperty("user.home"), "Company-Management", "employer-images", imageName);

            // Save the image to the specified directory
            Files.copy(image.getInputStream(), imagePath);

            // Set image URL in employer
            employer.setUrl(imagePath.toUri().toString());
        }

        // Handle relations

        employerRepository.save(employer);
        if (projectIds != null && !projectIds.isEmpty()) {
            Set<Project> projects = new HashSet<>(projectRepository.findAllById(projectIds));
            projects.forEach(project -> project.getEmployers().add(employer));
        }

        if (taskIds != null && !taskIds.isEmpty()) {
            Set<Task> tasks = new HashSet<>(taskRepository.findAllById(taskIds));
            tasks.forEach(task -> task.getEmployer().add(employer));
        }

        if (materialIds != null && !materialIds.isEmpty()) {
            Set<Material> materials = new HashSet<>(materialRepository.findAllById(materialIds));
          employer.setMaterials(materials);
        }

        if (salaryIds != null && !salaryIds.isEmpty()) {
            Set<Salary> salaries = new HashSet<>(salaryRepository.findAllById(salaryIds));
            salaries.forEach(salary -> salary.setEmployers(employer));
        }

        if (paymentIds != null && !paymentIds.isEmpty()) {
            Set<Payment> payments = new HashSet<>(paymentRepository.findAllById(paymentIds));
            payments.forEach(payment -> payment.setEmployer(employer));
        }

        if (userId != null) {
            User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
            user.setEmployer(employer);
        }

        return employer;
    }

    public void update(final Long id, final EmployerDTO employerDTO) {
        final Employer employer = employerRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(employerDTO, employer);
        employerRepository.save(employer);
    }

    public void delete(final Long id) {
        final Employer employer = employerRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        // remove many-to-many relations at owning side
        projectRepository.findAllByEmployers(employer)
                .forEach(project -> project.getEmployers().remove(employer));
        taskRepository.findAllByEmployer(employer)
                .forEach(task -> task.getEmployer().remove(employer));
        employerRepository.delete(employer);
    }

    private EmployerDTO mapToDTO(final Employer employer, final EmployerDTO employerDTO) {
        if (employer == null) {
            throw new IllegalArgumentException("Employer cannot be null");
        }
        employerDTO.setId(employer.getId());
        employerDTO.setName(employer.getName());
        employerDTO.setPhone(employer.getPhone());
        employerDTO.setCin(employer.getCin());
        employerDTO.setEmail(employer.getEmail());
        employerDTO.setAdress(employer.getAdress());
        employerDTO.setHireDate(employer.getHireDate());
        employerDTO.setBirthDate(employer.getBirthDate());
        employerDTO.setUrl(employer.getUrl());
        employerDTO.setMaterials(employer.getMaterials().stream()
                .map(material -> material.getId())
                .toList());
        employerDTO.setUser(employer.getUser() == null ? null : employer.getUser().getId());
        return employerDTO;
    }

    private Employer mapToEntity(final EmployerDTO employerDTO, final Employer employer) {
        employer.setName(employerDTO.getName());
        employer.setPhone(employerDTO.getPhone());
        employer.setCin(employerDTO.getCin());
        employer.setEmail(employerDTO.getEmail());
        employer.setAdress(employerDTO.getAdress());
        employer.setHireDate(employerDTO.getHireDate());
        employer.setBirthDate(employerDTO.getBirthDate());
        employer.setUrl(employerDTO.getUrl());
        final List<Material> materials = materialRepository.findAllById(
                employerDTO.getMaterials() == null ? Collections.emptyList() : employerDTO.getMaterials());
        if (materials.size() != (employerDTO.getMaterials() == null ? 0 : employerDTO.getMaterials().size())) {
            throw new NotFoundException("one of materials not found");
        }
        employer.setMaterials(new HashSet<>(materials));
        final User user = employerDTO.getUser() == null ? null : userRepository.findById(employerDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        employer.setUser(user);
        return employer;
    }

    public boolean userExists(final Long id) {
        return employerRepository.existsByUserId(id);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Employer employer = employerRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Salary employersSalary = salaryRepository.findFirstByEmployers(employer);
        if (employersSalary != null) {
            referencedWarning.setKey("employer.salary.employers.referenced");
            referencedWarning.addParam(employersSalary.getId());
            return referencedWarning;
        }
        final Payment employerPayment = paymentRepository.findFirstByEmployer(employer);
        if (employerPayment != null) {
            referencedWarning.setKey("employer.payment.employer.referenced");
            referencedWarning.addParam(employerPayment.getId());
            return referencedWarning;
        }
        return null;
    }
//==================================================

    public EmployerDTO getEmployerByName(String name) {
        Employer employer = employerRepository.getEmployerByNameContaining(name);
        return employer != null ? mapToDTO(employer, new EmployerDTO()) : null;
    }
    public EmployerDTO getEmployerBySalaryId(Long salaryId) {
        Salary salary = salaryRepository.findById(salaryId)
                .orElseThrow(() -> new NotFoundException("Salary not found with id: " + salaryId));
        Employer employer = salary.getEmployers();
        return mapToDTO(employer, new EmployerDTO());
    }


    public List<EmployerDTO> getEmployersByTaskId(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new NotFoundException("Task not found with id: " + taskId));
        return task.getEmployer().stream()
                .map(employer -> mapToDTO(employer, new EmployerDTO()))
                .collect(Collectors.toList());
    }


    public List<EmployerDTO> getAllEmployersByMaterial(Long materialId) {
        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new NotFoundException("Material not found with id: " + materialId));
        return employerRepository.findAllByMaterials(material).stream()
                .map(employer -> mapToDTO(employer, new EmployerDTO()))
                .toList();
    }

    public EmployerDTO getEmployerByPaymentId(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new NotFoundException("Payment not found with id: " + paymentId));
        Employer employer = payment.getEmployer();
        return mapToDTO(employer, new EmployerDTO());
    }

    public List<EmployerDTO> findAllByProjectId(Long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(NotFoundException::new);
        return employerRepository.findAllByProjets(project).stream()
                .map(employer -> mapToDTO(employer, new EmployerDTO()))
                .toList();

    }

    public EmployerDTO getEmployerByUserName(String userName) {
        User user = userRepository.findByUsernameContaining(userName);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        Employer employer = employerRepository.findByUser(user);
        if (employer == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employer not found");
        }
        return mapToDTO(employer, new EmployerDTO());
    }

}
