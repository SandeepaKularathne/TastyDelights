package lk.tastydelights.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;



public interface ProductDao extends JpaRepository<Product,Integer>{

    /*-------------------- Duplicate Check ---------------------------------------------------- */    

    // support - native, HQL, JPQL(default)
    @Query(value = "select pro from Product pro where pro.productname=?1")
    public Product getByProductName(String productname);
    

    /*-----------------------Add Next Number ----------------------------------------- */

    /*
     * query to get next number
     * if the empno is given as E001 then the query should be
     * concat, lpad, substring , max all function used in this query
     * (e.emp,2) means after the E 2nd letter should be start with lpad
     */

     
    @Query(value = "SELECT concat('Pro', lpad(substring(max(p.productcode), 4) + 1, 5, '0')) FROM tastydelights.product AS p;", nativeQuery = true)
    // lapd() --------> its a function which used to access left side string
    public String getStringNextNumber();

    @Query(value = "SELECT p FROM Product p where p.id in (SELECT cohp.product_id.id FROM CustomerOrderHasProduct cohp where cohp.customerorder_id.id=?1)")
    public List<Product>getProductNameByCOrder(Integer coid);
}
