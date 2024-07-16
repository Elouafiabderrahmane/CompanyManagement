package ma.barakatouna.company_management.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ma.barakatouna.company_management.model.Frequency;

import java.time.LocalDate;


@Entity
@Getter
@Setter
public class Salary {

    @Id
    @Column(nullable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Double amount;

    @Column
    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @Column(columnDefinition = "tinyint", length = 1)
    private Boolean paid;

    @Column
    private LocalDate startingDate;

    @Column
    private String endingDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employers_id")
    private Employer employer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id")
    private Material material;

}
