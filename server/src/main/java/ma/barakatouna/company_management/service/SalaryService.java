package ma.barakatouna.company_management.service;

import ma.barakatouna.company_management.model.SalaryDTO;

import java.util.List;

public interface SalaryService {

    List<SalaryDTO> findAll();

    SalaryDTO get(Long id);

    Long create(SalaryDTO salaryDTO);

    void update(Long id, SalaryDTO salaryDTO);

    void delete(Long id);
}
