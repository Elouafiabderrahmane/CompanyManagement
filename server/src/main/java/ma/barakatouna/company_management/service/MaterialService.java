package ma.barakatouna.company_management.service;

import ma.barakatouna.company_management.model.MaterialDTO;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.stereotype.Service;

import java.util.List;
@Service

public interface MaterialService {
    List<MaterialDTO> findAll();

    MaterialDTO get(Long id);

    Long create(MaterialDTO materialDTO);

    void update(Long id, MaterialDTO materialDTO);

    void delete(Long id);

    ReferencedWarning getReferencedWarning(Long id);
}
