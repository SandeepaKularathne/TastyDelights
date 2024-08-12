package lk.tastydelights.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RoleController {

    @Autowired
    private RoleDao dao;
    

    @GetMapping(value = "/role/list" , produces = "application/json")
    public List<Role>getAllData(){
        return dao.findAll();
    }


    //get mapping for get employee without having user account [test URL ------> /employee/listbywithoutuseraccount ] 
  @GetMapping(value = "/role/listwithoutadmin" , produces = "application/json")
  public List<Role> getRoleListWithoutAdmin(){
	return dao.listWithoutAdmin();
  }

}
