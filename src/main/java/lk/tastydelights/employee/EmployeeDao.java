package lk.tastydelights.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface EmployeeDao extends JpaRepository<Employee, Integer> {

/*-------------------- Duplicate Check ---------------------------------------------------- */    

    // support - native, HQL, JPQL(default)
    @Query(value = "select e from Employee e where e.email=?1")
    public Employee getByEmail(String email);

    @Query(value = "select e from Employee e where e.nic=?1")
    public Employee getByNic(String nic);


/*-----------------------Add Next Number ----------------------------------------- */

    /*
     * query to get next number
     * if the empno is given as E001 then the query should be
     * concat, lpad, substring , max all function used in this query
     * (e.emp,2) means after the E 2nd letter should be start with lpad
     */

    @Query(value = "SELECT concat('Emp', lpad(substring(max(e.empno), 4) + 1, 5, '0')) FROM tastydelights.employee AS e;", nativeQuery = true)
    // lapd() --------> its a function which used to access left side string
    public String getStringNextNumber();


    
/*------------------------------ Qury for employee list without user account ------------------------------------------------------------------------ */
   /* in user table employee-id is a foreign key of employee table. so if we want to get the users in employee table by using the foreign key in user table
         this is a native query */
         @Query( "select e from Employee e where e.id not in (select u.employee_id.id from User u)")
         public List<Employee> getEmployeeListWithoutUserAccount();
}


