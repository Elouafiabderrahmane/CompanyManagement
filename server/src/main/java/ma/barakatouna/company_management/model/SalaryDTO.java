package ma.barakatouna.company_management.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


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

    private Long material;

}
