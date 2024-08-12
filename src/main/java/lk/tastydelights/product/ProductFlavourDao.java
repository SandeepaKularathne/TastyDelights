package lk.tastydelights.product;

import org.springframework.data.jpa.repository.JpaRepository;

// interface extends into jparepository <modalfile, datatype of pk>
public interface ProductFlavourDao extends JpaRepository<ProductFlavour,Integer> {
    
}
