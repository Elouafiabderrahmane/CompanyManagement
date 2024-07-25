package ma.barakatouna.company_management.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.time.LocalDate;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class Project {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(name = "\"description\"", columnDefinition = "longtext")
    private String description;

    @Column
    private Double budget;

    @Column(columnDefinition = "tinyint", length = 1)
    private Boolean paid;

    @Column(columnDefinition = "tinyint", length = 1)
    private Boolean done;

    @Column
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Column
    private String url;

    @ManyToMany
    @JoinTable(
            name = "ProjectEmployer",
            joinColumns = @JoinColumn(name = "projectId"),
            inverseJoinColumns = @JoinColumn(name = "employerId")
    )
    private Set<Employer> employers;

    @OneToMany(mappedBy = "project")
    private Set<Task> tasks;

    @ManyToMany
    @JoinTable(
            name = "ProjectMaterial",
            joinColumns = @JoinColumn(name = "projectId"),
            inverseJoinColumns = @JoinColumn(name = "materialId")
    )
    private Set<Material> materials;

    @OneToOne(mappedBy = "project", fetch = FetchType.LAZY)
    private Payment payment;

}
