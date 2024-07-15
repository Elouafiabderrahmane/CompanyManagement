package ma.barakatouna.company_management.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;


@Getter
@Setter
public class ProjectDTO {

    private Long id;

    @Size(max = 255)
    private String name;

    private String description;

    private Double budget;

    private Boolean paid;

    private Boolean done;

    private LocalDate startDate;

    private LocalDate endDate;

    @Size(max = 255)
    private String url;

    private List<Long> employers;

    private List<Long> materials;

}
