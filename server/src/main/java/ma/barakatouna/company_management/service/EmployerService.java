package ma.barakatouna.company_management.service;

import ma.barakatouna.company_management.model.EmployerDTO;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.stereotype.Service;

import java.util.List;
@Service

public interface EmployerService {
    List<EmployerDTO> findAll();

    EmployerDTO get(Long id);

    Long create(EmployerDTO employerDTO);

    void update(Long id, EmployerDTO employerDTO);

    void delete(Long id);

    boolean userExists(Long id);

    ReferencedWarning getReferencedWarning(Long id);
}
