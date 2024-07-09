package ma.barakatouna.company_management.service;

import ma.barakatouna.company_management.model.TaskDTO;
import org.springframework.stereotype.Service;

import java.util.List;
@Service

public interface TaskService {
    List<TaskDTO> findAll();

    TaskDTO get(Long id);

    Long create(TaskDTO taskDTO);

    void update(Long id, TaskDTO taskDTO);

    void delete(Long id);
}
