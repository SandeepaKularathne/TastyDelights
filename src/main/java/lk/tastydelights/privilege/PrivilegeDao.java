package lk.tastydelights.privilege;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

//fully constact abract class eka thamai interface 

//even if privilegeDao doesnt have any property but it was extended to JpaRepository so its property will belongs to Dao too
public interface PrivilegeDao extends JpaRepository<Privilege, Integer> {

    // create query for privilege object by given role id and module id

    @Query("select p from Privilege p where p.role_id.id=?1 and p.module_id.id=?2")
    Privilege getByRoleModule(Integer roleid, Integer moduleid);

    // create query for get privilege by given user name and module name

    @Query(value = "SELECT bit_or(p.priv_sel) as sel , bit_or(p.priv_ins) as inst, bit_or(p.priv_upd) as upd , bit_or(p.priv_del) as del from tastydelights.privilege as p where p.role_id in (select uhr.role_id from tastydelights.user_has_role as uhr where uhr.user_id in (select u.id from tastydelights.user as u where u.username =?1)) and p.module_id in (select m.id from tastydelights.module as m where m.name =?2);", nativeQuery = true)
    public String getPrivilegeByUserModule(String username, String modulename);
}