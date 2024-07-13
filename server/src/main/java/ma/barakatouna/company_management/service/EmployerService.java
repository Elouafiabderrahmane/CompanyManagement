package ma.barakatouna.company_management.service;

import jakarta.transaction.Transactional;
import java.util.List;
import ma.barakatouna.company_management.entities.*;
import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.model.EmployerDTO;
import ma.barakatouna.company_management.model.MaterialDTO;
import ma.barakatouna.company_management.util.ReferencedWarning;

public interface EmployerService {

    List<EmployerDTO> findAll();

    EmployerDTO get(Long id);

    Long create(EmployerDTO employerDTO);

    void update(Long id, EmployerDTO employerDTO);

    void delete(Long id);

    boolean userExists(Long id);

    ReferencedWarning getReferencedWarning(Long id);





    List<EmployerDTO> getAllEmployersByMaterial(Long materialId);

    List<EmployerDTO> findAllByProjectId(Long projectId);

    EmployerDTO getEmployerByPaymentId(Long paymentId);

    List<EmployerDTO> getEmployersByTaskId(Long taskId);

    EmployerDTO getEmployerBySalaryId(Long salaryId);
}
