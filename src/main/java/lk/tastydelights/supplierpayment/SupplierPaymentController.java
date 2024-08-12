package lk.tastydelights.supplierpayment;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import lk.tastydelights.privilege.PrivilegeController;


@RestController // make easier to work with data in a format suitable for web services
@RequestMapping(value = "/supplierpayment") // class level mapping. meka use karama mapping name value eka liyadhi /user eken patanganna oneh nah.
public class SupplierPaymentController {

   
	// create Employeedao instance
	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the employeedao by using autowired so all the content
	// inside theemployee dao will connect with this file
	private SupplierPaymentDao dao;

	@Autowired
	private PrivilegeController privilegeController;

  		/*
	 * --------------------------- Mapping for UI interace
	 * ---------------------------------------
	 */
	@RequestMapping
	public ModelAndView supPayUI() {

		// get loged user authentication object using security context in webconfig file 
        //type object log wecha userge authentication object 

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView supPayView = new ModelAndView();
		supPayView.addObject("title" , "Supplier Payment Management - Tasty Delights");
        supPayView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....

		supPayView.setViewName("supplierpayment.html");
		return supPayView;
	}

     /*
	 * -------------------------------- FindAll ------------------------------------------------
	 */
	// define findall get mapping for all spayment data --> URL(/spayment/findall)
	@RequestMapping(value = "/findall", produces = "application/json") // application/json eken content type eka thamai kiyanne ajax eke
	public List<SupplierPayment> getallData() {
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier Payment");
		if (!logUserPrivi.get("select")){
		       return new ArrayList<>(); 
		}
		
		return dao.findAll(Sort.by(Direction.DESC, "id"));
	}

		/*
	 * ------------------------- Post Mapping For Add Function
	 * ---------------------------------------
	 */

	/*
	 * creating post mapping to save spayment record when we click the add button in
	 * form
	 */
	// mapping name
	@PostMapping
	/*
	 * RequestBody eken frontend eke thiyena data eka backned eken ganna puluwan
	 * SupplierPayment - variable type
	 * spayment - variable / object
	 */
	public String save(@RequestBody SupplierPayment spayment) {

		// Authentication and Authorization

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier Payment");

		if (!logUserPrivi.get("insert")) {
			return "Add is Not Completed  : You haven't Privilege";

		}
/** --------------------------------------------------------Set Next Number * ---------------------------------------------------------------------------------------- */


		// try catch eka use karanne db eken insert query eka weda netham ena error eka
		// exception eken thami catch karala message widhihata yawanne
		try {

			spayment.setAddeddatetime(LocalDateTime.now());
			spayment.setAddeduser(1);

			//create nextnumber variable to store nextnumber in db calling
			//geStringNextNumber() in dao
			String nextNumber = dao.getStringNextNumber();
			if (nextNumber.equals(null) || nextNumber.equals("")) {
				spayment.setBillno("SUP20240511001"); // billno auto generator
			} else {
				spayment.setBillno(nextNumber);
			}

			// call operator
			dao.save(spayment); // runs the insert query. methana id ekak neh enissa insert karala
								// therei.........
			// spayment is an entity object
			return "OK";
			// return "nextNumber" meka use karala alrt eke next enah record eke id eka
			// ganna puluwan
			// ekata js submit part eketh change karanna oneh.... look at the submit code

		} catch (Exception e) {
			return "Save is Not Completed :" + e.getMessage();
		}

	}

    
}
