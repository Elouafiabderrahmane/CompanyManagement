package ma.barakatouna.company_management.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserDTO {

    private Long id;

    @Size(max = 255)
    private String username;

    @Size(max = 255)
    private String password;

    private UserRole role;

}
