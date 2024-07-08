package ma.barakatouna.company_management.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;
import ma.barakatouna.company_management.model.UserRole;


@Entity
@Getter
@Setter
public class User {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String username;

    @Column
    private String password;

    @Column(name = "\"role\"")
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private Employer employer;

}
