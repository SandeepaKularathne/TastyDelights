package lk.tastydelights.customer;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CustomerDao extends JpaRepository<Customer, Integer> {

    /*---------------------Duplicate Check-------------------------- */
    // support - native, HQL, JPQL(default)
    @Query("SELECT c FROM Customer c WHERE c.mobile = ?1")
    public Customer getByMobile(String mobile);

    @Query("SELECT c FROM Customer c WHERE c.email = ?1")
    public Customer getByEmail(String email);

    /*-----------------------Add Next Number ----------------------------------------- */
    /** query to get next number
     * if the empno is given as E001 then the query should be
     * concat, lpad, substring , max all function used in this query
     * (e.emp,2) means after the E 2nd letter should be start with lpad
     */

    @Query(value = "SELECT concat('Cus', lpad(substring(max(c.cusno), 4) + 1, 5, '0')) FROM tastydelights.customer AS c;", nativeQuery = true)
    // lapd() --------> its a function which used to access left side string
    public String getStringNextNumber();

    /*------------------------------ Qury for supplier list in purchase order ------------------------------------------------------------- */
   /* in user table employee-id is a foreign key of employee table. so if we want to get the users in employee table by using the foreign key in user table
         this is a native query */

         //purchseorder managenent ..... 
         @Query( value = "select new Customer(c.id, c.firstname, c.lastname, c.cusno , c.mobile) from Customer c where c.customerstatus_id.id = 1")
         public List<Customer> getActiveList();

}