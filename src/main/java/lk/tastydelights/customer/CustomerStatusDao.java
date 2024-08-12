package lk.tastydelights.customer;

import org.springframework.data.jpa.repository.JpaRepository;

// interface extends into jparepository <modalfile, datatype of pk>
public interface CustomerStatusDao extends JpaRepository<CustomerStatus,Integer> {
    
}
