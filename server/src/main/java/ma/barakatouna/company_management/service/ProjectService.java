package ma.barakatouna.company_management.service;

import java.util.List;
import ma.barakatouna.company_management.model.ProjectDTO;
import ma.barakatouna.company_management.util.ReferencedWarning;

public interface ProjectService {

    List<ProjectDTO> findAll();

    ProjectDTO get(Long id);

    Long create(ProjectDTO projectDTO);

    void update(Long id, ProjectDTO projectDTO);

    void delete(Long id);

    ReferencedWarning getReferencedWarning(Long id);
}
