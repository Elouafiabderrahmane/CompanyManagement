package ma.barakatouna.company_management.model;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PaymentDTO {

    private Long id;

    private LocalDate time;

    private Type type;

    private Double amount;

    @PaymentProjectUnique
    private Long project;

    private Long material;

    private Long employer;

}
