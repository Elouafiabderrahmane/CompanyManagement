package ma.barakatouna.company_management.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import ma.barakatouna.company_management.model.Tasktype;


@Entity
@Getter
@Setter
public class Task {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @Enumerated(EnumType.STRING)
    private Tasktype tasktype;

    @Column(columnDefinition = "tinyint", length = 1)
    private Boolean done;

    @Column
    private String title;

    @Column(name = "\"description\"", columnDefinition = "longtext")
    private String description;

    @Column
    private LocalDate startingDate;

    @Column
    private LocalDate endingDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projet_id")
    private Project projet;

    @ManyToMany
    @JoinTable(
            name = "TaskEmployer",
            joinColumns = @JoinColumn(name = "taskId"),
            inverseJoinColumns = @JoinColumn(name = "employerId")
    )
    private Set<Employer> employer;

    @ManyToMany(mappedBy = "tasks")
    private Set<Material> materials;

}
