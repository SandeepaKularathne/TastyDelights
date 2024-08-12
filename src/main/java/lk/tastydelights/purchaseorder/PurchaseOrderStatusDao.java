package lk.tastydelights.purchaseorder;

import org.springframework.data.jpa.repository.JpaRepository;

// interface extends into jparepository <modalfile, datatype of pk>
public interface PurchaseOrderStatusDao extends JpaRepository<PurchaseOrderStatus,Integer> {
    
}
