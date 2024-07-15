package ma.barakatouna.company_management.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;


@Getter
@Setter
public class EmployerDTO {

    private Long id;

    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String phone;

    @Size(max = 255)
    private String cin;

    @Size(max = 255)
    private String email;

    @Size(max = 255)
    private String adress;

    private LocalDate hireDate;

    private LocalDate birthDate;

    @Size(max = 255)
    private String url;

    private List<Long> materials;

    @EmployerUserUnique
    private Long user;

}
