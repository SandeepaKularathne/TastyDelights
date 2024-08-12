package lk.tastydelights.production;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.tastydelights.employee.Employee;
import lk.tastydelights.privilege.PrivilegeController;



@RestController// make easier to work with data in a format suitable for web services
@RequestMapping(value = "/production") // class level mapping. meka use karama mapping name value eka liyadhi /user
										// eken patanganna oneh nah.
public class ProductionController {

	@Autowired
	private ProductionDao productionDao;

	@Autowired
	private PrivilegeController privilegeController;

    /** --------------------------- Mapping for UI interace --------------------------------------- **/

	 @RequestMapping
	public ModelAndView productionUI() {

		// get loged user authentication object using security context in webconfig file 
        //type object log wecha userge authentication object 

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView productionView = new ModelAndView();
		productionView.addObject("title" , "Production - Tasty Delights");
        productionView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....

		productionView.setViewName("production.html");
		return productionView;

		
	}	

		/*
	 * -------------------------------- FindAll
	 * ------------------------------------------------
	 */
	// define findall get mapping for all employee data --> URL(/employee/findall)
	@RequestMapping(value = "/findall", produces = "application/json") // application/json eken content type eka thamai
																		// kiyanne ajax eke
	public List<Production> getallData() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Production");
		if (!logUserPrivi.get("select")){
		       return new ArrayList<>(); 
		}

		return productionDao.findAll(Sort.by(Direction.DESC, "id"));
	}

    
}
