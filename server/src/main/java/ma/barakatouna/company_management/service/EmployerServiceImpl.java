package ma.barakatouna.company_management.service;

import jakarta.transaction.Transactional;
import ma.barakatouna.company_management.entities.*;
import ma.barakatouna.company_management.model.EmployerDTO;
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
public class EmployerServiceImpl implements EmployerService{

    private final EmployerRepository employerRepository;
    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final SalaryRepository salaryRepository;
    private final PaymentRepository paymentRepository;

    public EmployerServiceImpl(final EmployerRepository employerRepository,
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

    public Long create(final EmployerDTO employerDTO) {
        final Employer employer = new Employer();
        mapToEntity(employerDTO, employer);
        return employerRepository.save(employer).getId();
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

}
