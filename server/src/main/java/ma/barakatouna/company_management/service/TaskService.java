package ma.barakatouna.company_management.service;

import java.util.List;
import ma.barakatouna.company_management.model.TaskDTO;

public interface TaskService {

    List<TaskDTO> findAll();

    TaskDTO get(Long id);

    Long create(TaskDTO taskDTO);

    void update(Long id, TaskDTO taskDTO);

    void delete(Long id);
}
