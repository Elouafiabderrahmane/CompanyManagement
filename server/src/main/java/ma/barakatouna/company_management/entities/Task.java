package ma.barakatouna.company_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ma.barakatouna.company_management.model.Tasktype;

import java.time.LocalDate;
import java.util.Set;


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
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToMany
    @JoinTable(
            name = "TaskEmployer",
            joinColumns = @JoinColumn(name = "taskId"),
            inverseJoinColumns = @JoinColumn(name = "employersId")
    )
    private Set<Employer> employer;

    @ManyToMany(mappedBy = "tasks")
    private Set<Material> materials;

}
