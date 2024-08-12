package lk.tastydelights.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserDao extends JpaRepository<User, Integer> {

    // create query for get user by given user name
    @Query("select u from User u where u.username=?1")
    public User getUserByUserName(String username);

    // Custom query to retrieve a user by the given email.
    @Query(value = "select u from User u where u.email = ?1") // Using named parameter ?1 for the email parameter.
    public User getByEmail(String email); // Method declaration to execute the custom query.

    // create query for get user by given employee
    @Query("select u from User u where u.employee_id.id=?1")
    public User getUserByEmployee(Integer id); // employee_id.id object eke datatype eka integer


    /*Note : This interface extends JpaRepository, which provides methods for CRUD operations on the User entity. It includes custom query methods getByEmail, getByUserName, and getByEmployee to retrieve users by their email, username, and employee ID respectively. The queries are written using JPQL (Java Persistence Query Language) syntax. */
}
