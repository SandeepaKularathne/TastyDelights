package lk.tastydelights.customerorder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;



public interface CustomerOrderDao extends JpaRepository<CustomerOrder, Integer> {

    @Query(value = "select new CustomerOrder(co.id, co.customerorder_code,co.totalamount) from CustomerOrder co where co.customerorder_code IS NOT NULL")
    public List<CustomerOrder> getCOcodeList();


/*-------------------- Duplicate Check ---------------------------------------------------- */    

    // // support - native, HQL, JPQL(default)
    // @Query(value = "select e from Employee e where e.email=?1")
    // public Employee getByEmail(String email);

    // @Query(value = "select e from Employee e where e.nic=?1")
    // public Employee getByNic(String nic);


/*--------------------------------- Add Next Number ----------------------------------------- */

    /*
     * query to get next number
     * if the empno is given as E001 then the query should be
     * concat, lpad, substring , max all function used in this query
     * (e.emp,2) means after the E 2nd letter should be start with lpad
     */

    @Query(value = "SELECT concat('COd', lpad(substring(max(co.customerorder_code), 4) + 1, 5, '0')) FROM tastydelights.customerorder AS co;", nativeQuery = true)
    // lapd() --------> its a function which used to access left side string
    public String getStringNextNumber();


      @Query(value = "select new CustomerOrder(co.id,co.customerorder_code,co.totalamount) from CustomerOrder co where co.customerorderstatus_id.id=1 and co.customer_id.id=?1")
      public List<CustomerOrder> getCOrderListByCustomer(Integer cid);



}
