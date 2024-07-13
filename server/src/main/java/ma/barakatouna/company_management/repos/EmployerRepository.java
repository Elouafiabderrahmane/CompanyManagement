package ma.barakatouna.company_management.repos;

import java.util.List;
import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Salary;
import ma.barakatouna.company_management.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface EmployerRepository extends JpaRepository<Employer, Long> {

    Employer findFirstByMaterials(Material material);

    Employer findFirstByUser(User user);

    List<Employer> findAllByMaterials(Material material);

    boolean existsByUserId(Long id);


}
