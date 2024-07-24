package ma.barakatouna.company_management.repos;

import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Salary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface SalaryRepository extends JpaRepository<Salary, Long> {

    Salary findFirstByEmployers(Employer employer);

    Salary findFirstByMaterial(Material material);
    List<Salary> findAllSalariesByEmployers(Employer employer);

}
