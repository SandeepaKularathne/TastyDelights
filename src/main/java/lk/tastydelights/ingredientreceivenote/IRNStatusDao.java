package lk.tastydelights.ingredientreceivenote;

import org.springframework.data.jpa.repository.JpaRepository;

// interface extends into jparepository <modalfile, datatype of pk>
public interface IRNStatusDao extends JpaRepository<IRNStatus,Integer> {
    
}
