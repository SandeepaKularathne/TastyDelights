package lk.tastydelights.ingredient;

import org.springframework.data.jpa.repository.JpaRepository;

// interface extends into jparepository <modalfile, datatype of pk>
public interface IngredientStatusDao extends JpaRepository<IngredientStatus,Integer> {
    
}
