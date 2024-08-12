package lk.tastydelights.product;

import org.springframework.data.jpa.repository.JpaRepository;

// interface extends into jparepository <modalfile, datatype of pk>
public interface ProductTypeDao extends JpaRepository<ProductType,Integer> {
    
}
