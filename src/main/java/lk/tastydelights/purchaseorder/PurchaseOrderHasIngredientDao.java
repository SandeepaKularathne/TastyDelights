package lk.tastydelights.purchaseorder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface PurchaseOrderHasIngredientDao extends JpaRepository<PurchaseOrderHasIngredient,Integer>{

    @Query(value = "SELECT pohi FROM PurchaseOrderHasIngredient pohi where pohi.ingredient_id.id=?1 and pohi.purchaseorder_id.id=?2")
    public PurchaseOrderHasIngredient getpohiList(Integer ingredient , Integer purchaseorder ) ;
}
