package lk.tastydelights.ingredient;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
@Table(name = "ingredient") //for map with employee db table

@Data //for generate setter and getter to string.... etc function 
@NoArgsConstructor //default constructor 
@AllArgsConstructor //for generate all argument constructor
public class Ingredient {
    

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)//auto increment
@Column(name = "id", unique = true)
private Integer id;

@Column(name = "ingredientname")
@NotNull
private String ingredientname;

@Column(name = "ingno",unique = true)
@NotNull
private String ingno;

@Column(name = "unitofmeasurment")
private String unitofmeasurment;

@Column(name = "costperunit")
@NotNull
private BigDecimal costperunit;


@Column(name = "note")

private String note;

@Column(name = "addeddatetime")
@NotNull
private LocalDateTime addeddatetime; 

@Column(name = "updatedatetime")
private LocalDateTime updatedatetime;

@Column(name = "deletedatetime")
private LocalDateTime deletedatetime;

@Column(name = "addeduser")
@NotNull
private Integer addeduser;

@Column(name = "updateuser")
private Integer updateuser; 

@Column(name = "deleteuser")
private Integer deleteuser;

@ManyToOne
@JoinColumn(name = "ingredientstatus_id", referencedColumnName = "id")
private IngredientStatus ingredientstatus_id;

 //created a constructor ----> methanin selected object eka genaganna puluwan .......
 public Ingredient(Integer id,String ingno, String ingredientname, BigDecimal costperunit){
    this.id = id;
    this.ingno = ingno;
    this.ingredientname = ingredientname;
    this.costperunit = costperunit;
}

}
