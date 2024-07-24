package ma.barakatouna.company_management.service;

import jakarta.transaction.Transactional;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import ma.barakatouna.company_management.entities.*;
import ma.barakatouna.company_management.model.MaterialDTO;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.repos.MaterialRepository;
import ma.barakatouna.company_management.repos.PaymentRepository;
import ma.barakatouna.company_management.repos.ProjectRepository;
import ma.barakatouna.company_management.repos.SalaryRepository;
import ma.barakatouna.company_management.repos.TaskRepository;
import ma.barakatouna.company_management.util.NotFoundException;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final EmployerRepository employerRepository;
    private final SalaryRepository salaryRepository;
    private final PaymentRepository paymentRepository;

    public MaterialService(final MaterialRepository materialRepository,
            final TaskRepository taskRepository, final ProjectRepository projectRepository,
            final EmployerRepository employerRepository, final SalaryRepository salaryRepository,
            final PaymentRepository paymentRepository) {
        this.materialRepository = materialRepository;
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.employerRepository = employerRepository;
        this.salaryRepository = salaryRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<MaterialDTO> findAll() {
        final List<Material> materials = materialRepository.findAll(Sort.by("id"));
        return materials.stream()
                .map(material -> mapToDTO(material, new MaterialDTO()))
                .toList();
    }

    public MaterialDTO get(final Long id) {
        return materialRepository.findById(id)
                .map(material -> mapToDTO(material, new MaterialDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final MaterialDTO materialDTO) {
        final Material material = new Material();
        mapToEntity(materialDTO, material);
        return materialRepository.save(material).getId();
    }

    public void update(final Long id, final MaterialDTO materialDTO) {
        final Material material = materialRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(materialDTO, material);
        materialRepository.save(material);
    }

    public void delete(final Long id) {
        final Material material = materialRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        // remove many-to-many relations at owning side
        projectRepository.findAllByMaterials(material)
                .forEach(project -> project.getMaterials().remove(material));
        employerRepository.findAllByMaterials(material)
                .forEach(employer -> employer.getMaterials().remove(material));
        materialRepository.delete(material);
    }

    private MaterialDTO mapToDTO(final Material material, final MaterialDTO materialDTO) {
        materialDTO.setId(material.getId());
        materialDTO.setName(material.getName());
        materialDTO.setOwned(material.getOwned());
        materialDTO.setReference(material.getReference());
        materialDTO.setTasks(material.getTasks().stream()
                .map(task -> task.getId())
                .toList());
        return materialDTO;
    }

    private Material mapToEntity(final MaterialDTO materialDTO, final Material material) {
        material.setName(materialDTO.getName());
        material.setOwned(materialDTO.getOwned());
        material.setReference(materialDTO.getReference());
        final List<Task> tasks = taskRepository.findAllById(
                materialDTO.getTasks() == null ? Collections.emptyList() : materialDTO.getTasks());
        if (tasks.size() != (materialDTO.getTasks() == null ? 0 : materialDTO.getTasks().size())) {
            throw new NotFoundException("one of tasks not found");
        }
        material.setTasks(new HashSet<>(tasks));
        return material;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Material material = materialRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Salary materialSalary = salaryRepository.findFirstByMaterial(material);
        if (materialSalary != null) {
            referencedWarning.setKey("material.salary.material.referenced");
            referencedWarning.addParam(materialSalary.getId());
            return referencedWarning;
        }
        final Payment materialPayment = paymentRepository.findFirstByMaterial(material);
        if (materialPayment != null) {
            referencedWarning.setKey("material.payment.material.referenced");
            referencedWarning.addParam(materialPayment.getId());
            return referencedWarning;
        }
        return null;
    }
//============================
public List<MaterialDTO> getMaterialsByProjectId(Long projectId) {
    Project project = projectRepository.findById(projectId).orElseThrow(NotFoundException::new);
    List<Material> materials = materialRepository.findAllByProjets(project);
    return materials.stream()
            .map(material1 -> mapToDTO(material1, new MaterialDTO()))
            .collect(Collectors.toList());

}

    public List<MaterialDTO> getMaterialsOwn(Boolean Owned) {
        List<Material> materials = materialRepository.findAllByOwned(Owned);
        return materials.stream()
                .map(material1 -> mapToDTO(material1, new MaterialDTO()))
                .collect(Collectors.toList());
    }

    public List<MaterialDTO> getMaterialsByPaymentId(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElseThrow(NotFoundException::new);
        List<Material> materials = materialRepository.findAllByPayments(payment);
        return materials.stream()
                .map(material1 -> mapToDTO(material1, new MaterialDTO()))
                .collect(Collectors.toList());
    }

    public List<MaterialDTO> getMaterialsByTaskId(Long taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow(NotFoundException::new);
        List<Material> materials = materialRepository.findAllByTasks(task);
        return materials.stream()
                .map(material1 -> mapToDTO(material1, new MaterialDTO()))
                .collect(Collectors.toList());
    }

    public List<MaterialDTO> getMaterialsBySalaryId(Long salaryId) {
        Salary salary = salaryRepository.findById(salaryId).orElseThrow(NotFoundException::new);
        List<Material> materials = materialRepository.findAllBySalaries(salary);
        return materials.stream()
                .map(material1 -> mapToDTO(material1, new MaterialDTO()))
                .collect(Collectors.toList());
    }

    public List<MaterialDTO> getMaterialsByEmployerId(Long employerId) {
        Employer employer = employerRepository.findById(employerId).orElseThrow(NotFoundException::new);
        List<Material> materials = materialRepository.findAllByEmployers(employer);
        return materials.stream()
                .map(material -> mapToDTO(material, new MaterialDTO()))
                .collect(Collectors.toList());
    }

    public MaterialDTO getMaterialByName(String name) {
        List <Material>  materials =  materialRepository.findAllByNameContaining(name);
        return materials.stream()
                .map(material -> mapToDTO(material, new MaterialDTO()))
                .findFirst().orElseThrow(NotFoundException::new);
    }

    public Long countAll() {
        return materialRepository.count();
    }

}
