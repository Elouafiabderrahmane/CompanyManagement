package ma.barakatouna.company_management.service;

import ma.barakatouna.company_management.model.ProjectDTO;
import ma.barakatouna.company_management.util.ReferencedWarning;
import org.springframework.stereotype.Service;

import java.util.List;
@Service

public interface ProjectService {
    List<ProjectDTO> findAll();

    ProjectDTO get(Long id);

    Long create(ProjectDTO projectDTO);

    void update(Long id, ProjectDTO projectDTO);

    void delete(Long id);

    ReferencedWarning getReferencedWarning(Long id);
}
