package lk.tastydelights.purchaseorder;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

// interface extends into jparepository <modalfile, datatype of pk>
public interface PurchaseOrderDao extends JpaRepository<PurchaseOrder, Integer> {

    @Query(value = "select new PurchaseOrder(po.pordercode) from PurchaseOrder po where po.purchaseorderstatus_id.id = 1")
    public List<PurchaseOrder> getPOrderList();

    @Query(value = "select new PurchaseOrder(po.id,po.pordercode) from PurchaseOrder po where po.purchaseorderstatus_id.id=1 and po.supplier_id.id=?1")
    public List<PurchaseOrder> getPOrderListBySupplier(Integer sid);

    /*-----------------------Add Next Number ----------------------------------------- */

    /*
     * query to get next number
     * if the empno is given as E001 then the query should be
     * concat, lpad, substring , max all function used in this query
     * (e.emp,2) means after the E 2nd letter should be start with lpad
     */

    @Query(value = "SELECT concat('POd', lpad(substring(max(po.pordercode), 4) + 1, 5, '0')) FROM tastydelights.purchaseorder AS po;", nativeQuery = true)
    // lapd() --------> its a function which used to access left side string
    public String getStringNextNumber();


    

}
