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
public class Employer {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private String phone;

    @Column
    private String cin;

    @Column
    private String email;

    @Column
    private String adress;

    @Column
    private LocalDate hireDate;

    @Column
    private LocalDate birthDate;

    @Column
    private String url;

    @ManyToMany(mappedBy = "employers")
    private Set<Project> projets;

    @ManyToMany(mappedBy = "employer")
    private Set<Task> tasks;

    @ManyToMany
    @JoinTable(
            name = "EmployerMaterial",
            joinColumns = @JoinColumn(name = "employerId"),
            inverseJoinColumns = @JoinColumn(name = "materialId")
    )
    private Set<Material> materials;

    @OneToMany(mappedBy = "employers")
    private Set<Salary> salaries;

    @OneToMany(mappedBy = "employer")
    private Set<Payment> payments;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

}
