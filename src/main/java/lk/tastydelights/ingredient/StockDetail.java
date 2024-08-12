package lk.tastydelights.ingredient;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity//convert into persitance etity 
@Table(name = "stockdetail") //for map with employee db table

@Data //for generate setter and getter to string.... etc function 
@NoArgsConstructor //default constructor 
@AllArgsConstructor //for generate all argument constructor
public class StockDetail {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)//auto increment
@Column(name = "id", unique = true)
private Integer id;

@Column(name = "available_quantity")
@NotNull
private BigDecimal available_quantity;

@Column(name = "total_quantity")
@NotNull
private BigDecimal total_quantity;

@Column(name = "expire_date")
private LocalDate expire_date;

@ManyToOne
@JoinColumn(name = "ingredient_id", referencedColumnName = "id")
private Ingredient ingredient_id;

}
