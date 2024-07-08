package ma.barakatouna.company_management.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import ma.barakatouna.company_management.model.Frequency;


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
    private Employer employers;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salaries_id")
    private Material salaries;

}
