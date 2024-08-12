package lk.tastydelights.supplier;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplierstatus")

@Data // for generate setter and getter to string.... etc functions
@NoArgsConstructor // default constructor
@AllArgsConstructor // for generate all argument constructor

public class SupplierStatus {

    @Id // as primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto Increment
    @Column(name = "id", unique = true)
    private Integer id;

    @Column(name = "name" , unique = true)
    @NotNull
    private String name;

}
