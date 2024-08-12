package lk.tastydelights.user;

import org.springframework.data.jpa.repository.JpaRepository;



// interface extends into jparepository <modalfile, datatype of pk>
public interface UserStatusDao extends JpaRepository<UserStatus,Integer> {



}

