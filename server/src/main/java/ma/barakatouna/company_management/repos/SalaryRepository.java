package ma.barakatouna.company_management.repos;

import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;


public interface SalaryRepository extends JpaRepository<Salary, Long> {

    Salary findFirstByEmployers(Employer employer);

    Salary findFirstByMaterial(Material material);
    List<Salary> findAllSalariesByEmployers(Employer employer);



    @Query("SELECT p.startingDate, COUNT(p) FROM Salary p GROUP BY p.startingDate ORDER BY p.startingDate ASC")
    List<Object[]> findSalaryCountsGroupedByStartingDate();
}
