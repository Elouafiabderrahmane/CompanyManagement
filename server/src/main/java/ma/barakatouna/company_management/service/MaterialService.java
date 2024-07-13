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

    List<MaterialDTO> getMaterialsByProjectId(Long projectId);

    List<MaterialDTO> getMaterialsOwn(Boolean Owned);

    List <MaterialDTO> getMaterialsByPaymentId(Long paymentId);

    List<MaterialDTO> getMaterialsByTaskId(Long taskId);


    List<MaterialDTO> getMaterialsBySalaryId(Long salaryId);

    List<MaterialDTO> getMaterialsByEmployerId(Long employerId);
}
