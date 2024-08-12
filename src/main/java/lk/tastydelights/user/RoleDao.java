package lk.tastydelights.user;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RoleDao extends JpaRepository<Role,Integer> {

       //create query for get role list without admin
       @Query( "select r from Role r where r.id <>1")
       public List<Role> listWithoutAdmin();
   

    
}
