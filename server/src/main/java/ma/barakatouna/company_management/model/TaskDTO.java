package ma.barakatouna.company_management.model;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class TaskDTO {

    private Long id;

    private Tasktype tasktype;

    private Boolean done;

    @Size(max = 255)
    private String title;

    private String description;

    private LocalDate startingDate;

    private LocalDate endingDate;

    private Long project;

    private List<Long> employer;

}
