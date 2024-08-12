package lk.tastydelights.supplierpayment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SupplierPaymentDao extends JpaRepository<SupplierPayment, Integer>{
    /*-----------------------Add Next Number ----------------------------------------- */

    /*
     * query to get next number
     * if the empno is given as E001 then the query should be
     * concat, lpad, substring , max all function used in this query
     * (e.emp,2) means after the E 2nd letter should be start with lpad
     */

    @Query(value = "SELECT concat('Sup',year(current_date()),lpad(substring(max(spay.billno),10)+1,3,'0')) FROM tastydelights.supplierpayment as spay where year(spay.addeddatetime) = year(current_date());", nativeQuery = true) 
    // lapd() --------> its a function which used to access left side string
    public String getStringNextNumber();

    
}