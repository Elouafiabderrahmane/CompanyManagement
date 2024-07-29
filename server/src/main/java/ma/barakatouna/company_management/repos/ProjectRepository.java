package ma.barakatouna.company_management.repos;

import java.util.List;
import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Project;
import ma.barakatouna.company_management.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface ProjectRepository extends JpaRepository<Project, Long> {

    Project findFirstByEmployers(Employer employer);

    Project findFirstByMaterials(Material material);

    List<Project> findAllByEmployers(Employer employer);

    List<Project> findAllByMaterials(Material material);
    List<Project> findAllByTasks(Task Task);
    List<Project> findAllByNameContaining(String name);

    @Query("SELECT p.startDate, COUNT(p) FROM Project p GROUP BY p.startDate ORDER BY p.startDate ASC")
    List<Object[]> findProjectCountsGroupedByStartDate();
}
