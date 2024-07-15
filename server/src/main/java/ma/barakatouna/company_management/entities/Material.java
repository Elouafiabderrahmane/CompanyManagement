package ma.barakatouna.company_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;


@Entity
@Getter
@Setter
public class Material {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(columnDefinition = "tinyint", length = 1)
    private Boolean owned;

    @Column(name = "\"reference\"")
    private String reference;

    @ManyToMany(mappedBy = "materials")
    private Set<Project> projets;

    @ManyToMany(mappedBy = "materials")
    private Set<Employer> employers;

    @OneToMany(mappedBy = "material")
    private Set<Salary> salaries;

    @OneToMany(mappedBy = "material")
    private Set<Payment> payments;

    @ManyToMany
    @JoinTable(
            name = "MaterialTask",
            joinColumns = @JoinColumn(name = "materialId"),
            inverseJoinColumns = @JoinColumn(name = "taskId")
    )
    private Set<Task> tasks;

}
