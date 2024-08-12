package lk.tastydelights.employee;

import org.springframework.data.jpa.repository.JpaRepository;
// interface extends into jparepository <modalfile, datatype of pk>
public interface DesignationDao extends JpaRepository<Designation,Integer> {
    
}
