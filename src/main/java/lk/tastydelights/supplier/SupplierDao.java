package lk.tastydelights.supplier;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SupplierDao extends JpaRepository<Supplier, Integer> {
      /*---------------------Duplicate Check-------------------------- */

    // support - native, HQL, JPQL(default)
    @Query("SELECT s FROM Supplier s WHERE s.mobile = ?1")
    public Supplier getByMobile(String mobile);

    @Query("SELECT s FROM Supplier s WHERE s.email = ?1")
    public Supplier getByEmail(String email);

    /*-----------------------Add Next Number ----------------------------------------- */

    /*
     * query to get next number
     * if the empno is given as E001 then the query should be
     * concat, lpad, substring , max all function used in this query
     * (e.emp,2) means after the E 2nd letter should be start with lpad
     */

    @Query(value = "SELECT concat('Sup', lpad(substring(max(s.supno), 4) + 1, 5, '0')) FROM tastydelights.supplier AS s;", nativeQuery = true)
    // lapd() --------> its a function which used to access left side string
    public String getStringNextNumber();

           
/*------------------------------ Qury for supplier list in purchase order ------------------------------------------------------------- */
   /* in user table employee-id is a foreign key of employee table. so if we want to get the users in employee table by using the foreign key in user table
         this is a native query */

         //purchseorder managenent ..... 
         @Query( value = "select new Supplier(s.id, s.suppliername, s.supno) from Supplier s where s.supplierstatus_id.id = 1")
         public List<Supplier> getActiveList();

}
    



