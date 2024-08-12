package lk.tastydelights.privilege;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ModuleDao extends JpaRepository<Module,Integer> {

                                        //m.id kiyanne eka pk of the Module table 
                                                             //p.module_id kiyanne privilege eke thiyena forign key 
                                                                         //p.module_id.id kiyanne ara forign key thiyena table eke pk eka
                            //Module kiyanne ape entity file eka                                             
      @Query("select m from Module m where m.id not in (select p.module_id.id from Privilege p where p.role_id.id=?1)") //native eka convert karala iwwe jpa widhihata 
    public List<Module> getModuleByRole(Integer roleid); //abstarct methode becoz interface is a abstarct class

    @Query(value = "SELECT m.name FROM Module as m where m.id not in (SELECT p.module_id FROM Privilege as p where p.role_id in (SELECT uhr.role_id FROM tastydelights.user_has_role as uhr where uhr.user_id in (SELECT u.id FROM tastydelights.user as u where u.username=?1)) and p.priv_sel =1)", nativeQuery = true)
    public String[] getModuleByLoggedUser(String username);
}
