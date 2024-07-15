package ma.barakatouna.company_management.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


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
