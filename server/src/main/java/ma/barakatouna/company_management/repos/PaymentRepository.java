package ma.barakatouna.company_management.repos;

import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Payment;
import ma.barakatouna.company_management.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Payment findFirstByProject(Project project);

    Payment findFirstByMaterial(Material material);

    Payment findFirstByEmployer(Employer employer);

    boolean existsByProjectId(Long id);

}
