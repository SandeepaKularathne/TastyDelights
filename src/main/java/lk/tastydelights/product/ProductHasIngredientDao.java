package lk.tastydelights.product;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductHasIngredientDao extends JpaRepository<ProductHasIngredient,Integer>{

    @Query(value = "SELECT phi FROM ProductHasIngredient phi where phi.product_id.id = ?1")
    public List <ProductHasIngredient> getingquantitylist(Integer product);
    
}
