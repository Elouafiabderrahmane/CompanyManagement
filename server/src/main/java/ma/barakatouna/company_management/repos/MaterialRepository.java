package ma.barakatouna.company_management.repos;

import java.util.List;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface MaterialRepository extends JpaRepository<Material, Long> {

    Material findFirstByTasks(Task task);

    List<Material> findAllByTasks(Task task);

    @Query("SELECT m FROM Material m JOIN m.projets p WHERE p.id = :projectId")
    List<Material> findAllByProjectId(@Param("projectId") Long projectId);

}
