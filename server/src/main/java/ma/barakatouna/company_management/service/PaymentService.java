package ma.barakatouna.company_management.service;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Payment;
import ma.barakatouna.company_management.entities.Project;
import ma.barakatouna.company_management.model.PaymentDTO;
import ma.barakatouna.company_management.model.Type;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.repos.MaterialRepository;
import ma.barakatouna.company_management.repos.PaymentRepository;
import ma.barakatouna.company_management.repos.ProjectRepository;
import ma.barakatouna.company_management.util.NotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ProjectRepository projectRepository;
    private final MaterialRepository materialRepository;
    private final EmployerRepository employerRepository;

    public PaymentService(final PaymentRepository paymentRepository,
            final ProjectRepository projectRepository, final MaterialRepository materialRepository,
            final EmployerRepository employerRepository) {
        this.paymentRepository = paymentRepository;
        this.projectRepository = projectRepository;
        this.materialRepository = materialRepository;
        this.employerRepository = employerRepository;
    }


    public Payment createPayment(LocalDate time, Type type, Double amount, Long projectId, Long materialId, Long employerId) {
        Payment payment = new Payment();
        payment.setTime(time);
        payment.setType(type);
        payment.setAmount(amount);

        // Handle relations
        if (projectId != null) {
            Project project = projectRepository.findById(projectId).orElseThrow(() -> new   EntityNotFoundException("Project not found"));
            payment.setProject(project);
        }

        if (materialId != null) {
            Material material = materialRepository.findById(materialId).orElseThrow(() -> new EntityNotFoundException("Material not found"));
            payment.setMaterial(material);
        }

        if (employerId != null) {
            Employer employer = employerRepository.findById(employerId).orElseThrow(() -> new EntityNotFoundException("Employer not found"));
            payment.setEmployer(employer);
        }

        paymentRepository.save(payment);
        return payment;
    }
    public List<PaymentDTO> findAll() {
        final List<Payment> payments = paymentRepository.findAll(Sort.by("id"));
        return payments.stream()
                .map(payment -> mapToDTO(payment, new PaymentDTO()))
                .toList();
    }

    public PaymentDTO get(final Long id) {
        return paymentRepository.findById(id)
                .map(payment -> mapToDTO(payment, new PaymentDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final PaymentDTO paymentDTO) {
        final Payment payment = new Payment();
        mapToEntity(paymentDTO, payment);
        return paymentRepository.save(payment).getId();
    }

    public void update(final Long id, final PaymentDTO paymentDTO) {
        final Payment payment = paymentRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(paymentDTO, payment);
        paymentRepository.save(payment);
    }

    public void delete(final Long id) {
        paymentRepository.deleteById(id);
    }

    private PaymentDTO mapToDTO(final Payment payment, final PaymentDTO paymentDTO) {
        paymentDTO.setId(payment.getId());
        paymentDTO.setTime(payment.getTime());
        paymentDTO.setType(payment.getType());
        paymentDTO.setAmount(payment.getAmount());
        paymentDTO.setProject(payment.getProject() == null ? null : payment.getProject().getId());
        paymentDTO.setMaterial(payment.getMaterial() == null ? null : payment.getMaterial().getId());
        paymentDTO.setEmployer(payment.getEmployer() == null ? null : payment.getEmployer().getId());
        return paymentDTO;
    }

    private Payment mapToEntity(final PaymentDTO paymentDTO, final Payment payment) {
        payment.setTime(paymentDTO.getTime());
        payment.setType(paymentDTO.getType());
        payment.setAmount(paymentDTO.getAmount());
        final Project project = paymentDTO.getProject() == null ? null : projectRepository.findById(paymentDTO.getProject())
                .orElseThrow(() -> new NotFoundException("project not found"));
        payment.setProject(project);
        final Material material = paymentDTO.getMaterial() == null ? null : materialRepository.findById(paymentDTO.getMaterial())
                .orElseThrow(() -> new NotFoundException("material not found"));
        payment.setMaterial(material);
        final Employer employer = paymentDTO.getEmployer() == null ? null : employerRepository.findById(paymentDTO.getEmployer())
                .orElseThrow(() -> new NotFoundException("employer not found"));
        payment.setEmployer(employer);
        return payment;
    }

    public boolean projectExists(final Long id) {
        return paymentRepository.existsByProjectId(id);
    }

}
