package lk.tastydelights.supplier;

import org.springframework.data.jpa.repository.JpaRepository;



// interface extends into jparepository <modalfile, datatype of pk>
public interface SupplierStatusDao extends JpaRepository<SupplierStatus,Integer> {



}

