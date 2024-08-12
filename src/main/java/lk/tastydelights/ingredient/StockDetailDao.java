package lk.tastydelights.ingredient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;

// interface extends into jparepository <modalfile, datatype of pk>
public interface StockDetailDao extends JpaRepository<StockDetail,Integer> {

    @Query(value = "select sd from StockDetail sd where sd.ingredient_id.id = ?1 and sd.expire_date = ?2")
    public StockDetail getByIngredient(Integer ingredient_id,LocalDate expire_date );


    
}
