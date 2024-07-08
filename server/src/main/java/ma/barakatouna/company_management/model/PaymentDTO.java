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

    @PaymentProjetUnique
    private Long projet;

    private Long material;

    private Long employer;

}
