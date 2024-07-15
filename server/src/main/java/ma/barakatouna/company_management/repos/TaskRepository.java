package ma.barakatouna.company_management.repos;

import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Project;
import ma.barakatouna.company_management.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface TaskRepository extends JpaRepository<Task, Long> {

    Task findFirstByProject(Project project);

    Task findFirstByEmployer(Employer employer);

    List<Task> findAllByEmployer(Employer employer);

    List<Task> findByProjectId(Long projectId);
    long countTasksByProjectId(Long projectId);
    long countTasksByProjectIdAndDone(Long projectId, boolean done);


}
