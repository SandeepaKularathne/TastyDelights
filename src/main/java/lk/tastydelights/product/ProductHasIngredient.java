package lk.tastydelights.product;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.tastydelights.ingredient.Ingredient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;



@Entity  //convert into persistance entity 
@Table(name = "product_has_ingredient") //for map with employeestatus table db

@Data //for generate getter and setter to string ..... etc functions
@NoArgsConstructor // default consrtructor
@AllArgsConstructor // generate all argument constructor
public class ProductHasIngredient {

    @Id // Pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @JsonIgnore //meken forign key eken pass karana data eka blk karanna puluwan. ehema blk karanne nethm StackOverflowError ekak pass wenawa.... recursion 1kak balapana nissa
    private Product product_id;
   
    @ManyToOne
    @JoinColumn(name = "ingredient_id", referencedColumnName = "id")
    private Ingredient ingredient_id;

    @Column(name = "quantity")
    @NotNull
    private BigDecimal quantity;

}
