package ma.barakatouna.company_management.service;

import java.util.List;

import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.model.MaterialDTO;
import ma.barakatouna.company_management.util.ReferencedWarning;

public interface MaterialService {

    List<MaterialDTO> findAll();

    MaterialDTO get(Long id);

    Long create(MaterialDTO materialDTO);

    void update(Long id, MaterialDTO materialDTO);

    void delete(Long id);

    ReferencedWarning getReferencedWarning(Long id);

    List<Material> getMaterialsByProjectId(Long projectId);

    List<Material> getMaterialsOwn(Boolean Owned);

    List <Material> getMaterialsByPaymentId(Long paymentId);

    List<Material> getMaterialsByTaskId(Long taskId);


    List<Material> getMaterialsBySalaryId(Long salaryId);

    List<Material> getMaterialsByEmployerId(Long employerId);
}
