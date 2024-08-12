package lk.tastydelights.purchaseorder;

import java.math.BigDecimal;

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



@Entity  //convert into persistance entity 
@Table(name = "purchaseorder_has_ingredient") //for map with employeestatus table db

@Data //for generate getter and setter to string ..... etc functions
@NoArgsConstructor // default consrtructor
@AllArgsConstructor // generate all argument constructor
public class PurchaseOrderHasIngredient {

    @Id // Pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "purchaseorder_id", referencedColumnName = "id")
    @JsonIgnore //meken forign key eken pass karana data eka blk karanna puluwan. ehema blk karanne nethm StackOverflowError ekak pass wenawa.... recursion 1kak balapana nissa
    private PurchaseOrder purchaseorder_id;
   
    @ManyToOne
    @JoinColumn(name = "ingredient_id", referencedColumnName = "id")
    private Ingredient ingredient_id;

    @Column(name = "unitprice")
    @NotNull
    private BigDecimal unitprice;

    @Column(name = "linetotal")
    @NotNull
    private BigDecimal linetotal;

    @Column(name = "quantity")
    @NotNull
    private Integer quantity;

}
