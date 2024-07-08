package ma.barakatouna.company_management.repos;

import java.util.List;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MaterialRepository extends JpaRepository<Material, Long> {

    Material findFirstByTasks(Task task);

    List<Material> findAllByTasks(Task task);

}
