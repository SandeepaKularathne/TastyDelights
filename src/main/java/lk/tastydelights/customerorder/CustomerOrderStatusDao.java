package lk.tastydelights.customerorder;

import org.springframework.data.jpa.repository.JpaRepository;

// interface extends into jparepository <modalfile, datatype of pk>
public interface CustomerOrderStatusDao extends JpaRepository<CustomerOrderStatus,Integer> {
    
}
