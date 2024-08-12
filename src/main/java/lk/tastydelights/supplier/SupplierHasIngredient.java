package lk.tastydelights.supplier;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lk.tastydelights.ingredient.Ingredient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplier_has_ingredient")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierHasIngredient {

    @Id
    @ManyToOne
    @JoinColumn(name = "supplier_id" ,referencedColumnName = "id")
    private Supplier supplier_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "ingredient_id" ,referencedColumnName = "id")
    private Ingredient ingredient_id;
    
}
