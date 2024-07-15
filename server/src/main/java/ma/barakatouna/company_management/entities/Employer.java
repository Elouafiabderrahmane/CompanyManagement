package ma.barakatouna.company_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;


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

    @OneToMany(mappedBy = "employer")
    private Set<Salary> salaries;

    @OneToMany(mappedBy = "employer")
    private Set<Payment> payments;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

}
