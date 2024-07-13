package ma.barakatouna.company_management.repos;

import java.util.List;

import ma.barakatouna.company_management.entities.*;
import ma.barakatouna.company_management.model.MaterialDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface MaterialRepository extends JpaRepository<Material, Long> {

    Material findFirstByTasks(Task task);

    List<Material> findAllByTasks(Task task);

    List<Material> findAllByProjets( Project project);

    List<Material> findAllByOwned(Boolean owned);

    List <Material> findAllByPayments (Payment payment);

    List <Material> findAllBySalaries (Salary salary);

    List <Material> findAllByEmployers (Employer employer);



}
