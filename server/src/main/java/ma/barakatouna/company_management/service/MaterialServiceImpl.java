package ma.barakatouna.company_management.service;

import jakarta.transaction.Transactional;
import ma.barakatouna.company_management.entities.*;
import ma.barakatouna.company_management.model.MaterialDTO;
import ma.barakatouna.company_management.repos.*;
import ma.barakatouna.company_management.util.NotFoundException;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;


@Service
@Transactional
public  class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final EmployerRepository employerRepository;
    private final SalaryRepository salaryRepository;
    private final PaymentRepository paymentRepository;

    public MaterialServiceImpl(final MaterialRepository materialRepository,
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

    @Override
    public List<Material> getProjectMaterialsByProjectId(Long projectId) {
        Project project = projectRepository.findById(projectId ).orElseThrow(NotFoundException::new) ;
        return materialRepository.findAllByProjets(project);
    }

    @Override
    public List<Material> getMaterialsOwn(Boolean Owned) {
        return materialRepository.findAllByOwned(Owned);
    }

}
