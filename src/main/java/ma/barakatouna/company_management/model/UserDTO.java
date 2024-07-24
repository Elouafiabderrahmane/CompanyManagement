package ma.barakatouna.company_management.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserDTO {

    private Long id;

    @Size(max = 255)
    @UserUsernameUnique
    private String username;

    @Size(max = 255)
    private String password;

    @Size(max = 255)
    @UserEmailUnique
    private String email;

    private Boolean enabled;

}
