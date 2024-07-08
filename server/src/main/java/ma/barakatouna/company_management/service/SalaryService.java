package ma.barakatouna.company_management.service;

import java.util.List;
import ma.barakatouna.company_management.entities.Employer;
import ma.barakatouna.company_management.entities.Material;
import ma.barakatouna.company_management.entities.Salary;
import ma.barakatouna.company_management.model.SalaryDTO;
import ma.barakatouna.company_management.repos.EmployerRepository;
import ma.barakatouna.company_management.repos.MaterialRepository;
import ma.barakatouna.company_management.repos.SalaryRepository;
import ma.barakatouna.company_management.util.NotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class SalaryService {

    private final SalaryRepository salaryRepository;
    private final EmployerRepository employerRepository;
    private final MaterialRepository materialRepository;

    public SalaryService(final SalaryRepository salaryRepository,
            final EmployerRepository employerRepository,
            final MaterialRepository materialRepository) {
        this.salaryRepository = salaryRepository;
        this.employerRepository = employerRepository;
        this.materialRepository = materialRepository;
    }

    public List<SalaryDTO> findAll() {
        final List<Salary> salaries = salaryRepository.findAll(Sort.by("id"));
        return salaries.stream()
                .map(salary -> mapToDTO(salary, new SalaryDTO()))
                .toList();
    }

    public SalaryDTO get(final Long id) {
        return salaryRepository.findById(id)
                .map(salary -> mapToDTO(salary, new SalaryDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final SalaryDTO salaryDTO) {
        final Salary salary = new Salary();
        mapToEntity(salaryDTO, salary);
        return salaryRepository.save(salary).getId();
    }

    public void update(final Long id, final SalaryDTO salaryDTO) {
        final Salary salary = salaryRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(salaryDTO, salary);
        salaryRepository.save(salary);
    }

    public void delete(final Long id) {
        salaryRepository.deleteById(id);
    }

    private SalaryDTO mapToDTO(final Salary salary, final SalaryDTO salaryDTO) {
        salaryDTO.setId(salary.getId());
        salaryDTO.setAmount(salary.getAmount());
        salaryDTO.setFrequency(salary.getFrequency());
        salaryDTO.setPaid(salary.getPaid());
        salaryDTO.setStartingDate(salary.getStartingDate());
        salaryDTO.setEndingDate(salary.getEndingDate());
        salaryDTO.setEmployers(salary.getEmployers() == null ? null : salary.getEmployers().getId());
        salaryDTO.setSalaries(salary.getSalaries() == null ? null : salary.getSalaries().getId());
        return salaryDTO;
    }

    private Salary mapToEntity(final SalaryDTO salaryDTO, final Salary salary) {
        salary.setAmount(salaryDTO.getAmount());
        salary.setFrequency(salaryDTO.getFrequency());
        salary.setPaid(salaryDTO.getPaid());
        salary.setStartingDate(salaryDTO.getStartingDate());
        salary.setEndingDate(salaryDTO.getEndingDate());
        final Employer employers = salaryDTO.getEmployers() == null ? null : employerRepository.findById(salaryDTO.getEmployers())
                .orElseThrow(() -> new NotFoundException("employers not found"));
        salary.setEmployers(employers);
        final Material salaries = salaryDTO.getSalaries() == null ? null : materialRepository.findById(salaryDTO.getSalaries())
                .orElseThrow(() -> new NotFoundException("salaries not found"));
        salary.setSalaries(salaries);
        return salary;
    }

}
