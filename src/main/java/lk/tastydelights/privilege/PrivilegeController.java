package lk.tastydelights.privilege;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List; // this is used to import List 

@RestController // its must without this ntg will work inside this file service
@RequestMapping(value = "/privilege") // class level mapping. meka use karama mapping name value eka liyadhi
                                      // /privilege eken patanganna oneh nah.
public class PrivilegeController {

    @Autowired // dependancy injection
    private PrivilegeDao privilegeDao;

    // mapping for UI
    @RequestMapping
    public ModelAndView userUI() {

        // get loged user authentication object using security context in webconfig file 
        //type object log wecha userge authentication object 

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        ModelAndView privilegeView = new ModelAndView();
		privilegeView.addObject("title" , "Privilege Management- Tasty Delights");
        privilegeView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....

        privilegeView.setViewName("privilege.html");
        return privilegeView;

 
    }

    // @Autowired
    // private EmployeeDao employeeDao

    // dependancy Injection

    /*
     * public PrivilegeController(PrivilegeDoa dao, EmployeeDao dao)
     */

    // creating mapping for get all privilege ----> URL [/privilege/findall]
    @RequestMapping(value = "/findall", produces = "application/json") // UI ekata api was added to test
    public List<Privilege> getAllData() {
        // get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = getPrivilegeByUserModule(auth.getName(), "Privilege");
		if (!logUserPrivi.get("select")){
		       return new ArrayList<>(); //select privilege nethm empty array ekak return karanawaa 
		}

    

        return privilegeDao.findAll();
    }

    /*
     * ====================================== Post Mapping
     * =========================================================
     */

    @PostMapping
    public String savePrivilege(@RequestBody Privilege privilege) {

        // Authentication & Authorization

        
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = getPrivilegeByUserModule(auth.getName(), "Privilege");

		if (!logUserPrivi.get("insert")) {
			return "Add is Not Completed  : You haven't Privilege";

		}

        // duplication

        Privilege extPrivilege = privilegeDao.getByRoleModule(privilege.getRole_id().getId(),
                privilege.getModule_id().getId());
        if (extPrivilege != null) {
            return "Save not Completed : Privilege already exist by given role and module...";
        }

        try {

            // set auto generated value

            // opertaion
            privilegeDao.save(privilege);

            return "OK";
        } catch (Exception e) {
            return "Save Not Completed : " + e.getMessage();
        }
    }

	/*
	 * ---------------------------------------- Delete Mapping ----------------------------------------------
	 */

     @DeleteMapping
     public String delete(@RequestBody Privilege privilege) {
 
         // authentication and authorization

         
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = getPrivilegeByUserModule(auth.getName(), "Privilege");

		if (!logUserPrivi.get("delete")) {
			return "Delete is Not Completed  : You haven't Privilege";

		}
 
         // chcking whether the employee is existence or not
         Privilege extPrivilege = privilegeDao.getReferenceById(privilege.getId()); // frontend eke thiyena object eke id eka pass karanne getReferenceById ekata
         
         if (extPrivilege == null) {
             return "Delete Not Complete : Privilege Not Exists....";
         }
 
         try {
             // operator
 
             // hard delete
             // dao.delete(employee);
             /*
              * fetches a reference to an employee object based on its ID, and then deletes
              * that employee
              * from the database using the DAO
              * 
              * id eka dunnama full object eka ganna puluwan
              * 
              * dao.delete(dao.getReferenceById(employee.getId()));
              */
 
             // soft delete
             extPrivilege.setPriv_sel(false);
             extPrivilege.setPriv_ins(false);
             extPrivilege.setPriv_upd(false);
             extPrivilege.setPriv_del(false);

             
             privilegeDao.save(extPrivilege);// save extemp object(update)
 
             return "OK";
 
         } catch (Exception e) {
             return "Delete is Not Completed : " + e.getMessage();
         }
     }
 
/*===================================== Update Mapping =================================================== */
     @PutMapping
     public String updatePrivilege(@RequestBody Privilege privilege) {
 
         // authentication and authorization

         
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = getPrivilegeByUserModule(auth.getName(), "Privilege");

		if (!logUserPrivi.get("update")) {
			return "Update is Not Completed  : You haven't Privilege";

		}
 
         // chcking whether the employee is existence or not
         Privilege extPrivilege = privilegeDao.getReferenceById(privilege.getId()); // frontend eke thiyena object eke id eka pass karanne getReferenceById ekata
         
         if (extPrivilege == null) {
             return "Update Not Complete : Privilege Not Exists....";
            }
 
         try {
             // operator
 
             
             privilegeDao.save(extPrivilege);// save extemp object(update)
 
             return "OK";
 
         } catch (Exception e) {
             return "Update is Not Completed : " + e.getMessage();
         }
     }
 
//create get mapping for get privilege by logged user module 
@GetMapping(value = "/bylogedusermodule/{modulename}" , produces = "application/json")

public HashMap<String , Boolean> getPrivilegeByLogedUserModule(@PathVariable("modulename")String modulename){

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    return getPrivilegeByUserModule(auth.getName(), modulename); //username and module name methanin pass karanawa 

}



//define function for get privilege by user module...
     public HashMap<String , Boolean>  getPrivilegeByUserModule(String username , String modulename){

         HashMap<String , Boolean> userPrivilege = new HashMap<String , Boolean>();

         if (username.equals("Admin")) {
            userPrivilege.put("select", true);
            userPrivilege.put("insert", true);
            userPrivilege.put("update", true);
            userPrivilege.put("delete", true);
  
         } else {
            String userPrivi = privilegeDao.getPrivilegeByUserModule(username, modulename);

            String[] userPriviList = userPrivi.split(",");
            userPrivilege.put("select", userPriviList[0].equals("1"));
            userPrivilege.put("insert", userPriviList[1].equals("1"));
            userPrivilege.put("update", userPriviList[2].equals("1"));
            userPrivilege.put("delete", userPriviList[3].equals("1"));
  
            
         }

         return userPrivilege;
     }







}
