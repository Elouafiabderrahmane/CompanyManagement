package ma.barakatouna.company_management.repos;

import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Project;
import ma.barakatouna.company_management.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface EmployerRepository extends JpaRepository<Employer, Long> {

    Employer findFirstByMaterials(Material material);

    Employer findFirstByUser(User user);

    List<Employer> findAllByMaterials(Material material);

    boolean existsByUserId(Long id);

    List<Employer> findAllByProjets(Project project);

    Employer getEmployerByNameContaining(String name);

    

}
