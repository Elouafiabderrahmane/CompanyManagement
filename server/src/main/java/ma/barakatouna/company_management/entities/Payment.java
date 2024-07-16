package ma.barakatouna.company_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ma.barakatouna.company_management.model.Type;

import java.time.LocalDate;


@Entity
@Getter
@Setter
public class Payment {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDate time;

    @Column
    @Enumerated(EnumType.STRING)
    private Type type;

    @Column
    private Double amount;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", unique = true)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    private Material material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employers_id")
    private Employer employer;

}
