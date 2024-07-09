package ma.barakatouna.company_management.service;

import ma.barakatouna.company_management.model.SalaryDTO;
import org.springframework.stereotype.Service;

import java.util.List;
@Service

public interface SalaryService {
    List<SalaryDTO> findAll();

    SalaryDTO get(Long id);

    Long create(SalaryDTO salaryDTO);

    void update(Long id, SalaryDTO salaryDTO);

    void delete(Long id);
}
