package lk.tastydelights.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/designation") // class level mapping. meka use karama mapping name value eka liyadhi /designation

public class DesignationController {

    // create Desingationdao instance
	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the designatiodao by using autowired so all the content
	// inside the designation dao will connect with this file
    private DesignationDao dao;

    	
   /*  use thsi code instead of autiwired
        public UserController(UserDao dao){
        this.dao = dao;
    } */
    

    @GetMapping(value = "/findall" , produces = "application/json")
    public List<Designation>getAllData(){
        return dao.findAll();
    }
}
