package ma.barakatouna.company_management.model;

import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class MaterialDTO {

    private Long id;

    @Size(max = 255)
    private String name;

    private Boolean owned;

    @Size(max = 255)
    private String reference;

    private List<Long> tasks;

}
