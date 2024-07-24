package ma.barakatouna.company_management.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;


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
