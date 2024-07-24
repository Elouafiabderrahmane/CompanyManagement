package ma.barakatouna.company_management.entities;

import jakarta.persistence.*;

import java.util.Set;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class User {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    @Column
    private String password;

    @Column(unique = true)
    private String email;

    @Column(columnDefinition = "tinyint", length = 1)
    private Boolean enabled;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private Employer employer;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "UserRole",
            joinColumns = @JoinColumn(name = "userId"),
            inverseJoinColumns = @JoinColumn(name = "roleId")
    )
    private Set<Role> roles;

}
