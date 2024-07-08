package ma.barakatouna.company_management.model;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class SalaryDTO {

    private Long id;

    private Double amount;

    private Frequency frequency;

    private Boolean paid;

    private LocalDate startingDate;

    @Size(max = 255)
    private String endingDate;

    private Long employers;

    private Long salaries;

}
