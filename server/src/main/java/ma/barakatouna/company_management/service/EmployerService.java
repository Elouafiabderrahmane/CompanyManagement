package ma.barakatouna.company_management.service;

import ma.barakatouna.company_management.model.EmployerDTO;
import ma.barakatouna.company_management.util.ReferencedWarning;

import java.util.List;

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
