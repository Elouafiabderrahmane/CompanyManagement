package ma.barakatouna.company_management.repos;

import java.util.List;

import ma.barakatouna.company_management.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MaterialRepository extends JpaRepository<Material, Long> {

    Material findFirstByTasks(Task task);

    List<Material> findAllByNameContaining(String name);

    List<Material> findAllByTasks(Task task);

    List<Material> findAllByEmployers_Id(Long employerId);

    List<Material> findAllByProjets( Project project);

    List<Material> findAllByOwned(Boolean owned);

    List <Material> findAllByPayments (Payment payment);

    List <Material> findAllBySalaries (Salary salary);

    List <Material> findAllByEmployers (Employer employer);

    long count();

}
