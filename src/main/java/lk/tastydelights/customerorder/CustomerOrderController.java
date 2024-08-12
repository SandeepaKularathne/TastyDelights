package lk.tastydelights.customerorder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

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


import lk.tastydelights.privilege.PrivilegeController;
import lk.tastydelights.user.User;
import lk.tastydelights.user.UserDao;




@RestController // make easier to work with data in a format suitable for web services
@RequestMapping(value = "/customerorder") // class level mapping. meka use karama mapping name value eka liyadhi /user
// eken patanganna oneh nah.
public class CustomerOrderController {

	@Autowired
	private CustomerOrderStatusDao customerOrderStatusDao;

	@Autowired
	private CustomerOrderDao customerOrderDao;

	@Autowired
	private PrivilegeController privilegeController;

	@Autowired
	private UserDao userDao;



    
	/** ================================== Mapping for UI  interface=============================== */
	@RequestMapping
	public ModelAndView CustomerOrderUI() {

		// get loged user authentication object using security context in webconfig file 
        //type object log wecha userge authentication object 

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView customerOrderView = new ModelAndView();
		customerOrderView.addObject("title" , "Customer Order Management - Tasty Delights");
        customerOrderView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....

		customerOrderView.setViewName("customerorder.html");
		return customerOrderView;
	}

		/*
	 * -------------------------------- FindAll
	 * ------------------------------------------------
	 */
	// define findall get mapping for all customerOrder data --> URL(/customerOrder/findall)
	@RequestMapping(value = "/findall", produces = "application/json") // application/json eken content type eka thamai
																		// kiyanne ajax eke
	public List<CustomerOrder> getallData() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Customer Order");
		if (!logUserPrivi.get("select")){
		       return new ArrayList<>(); 
		}

		return customerOrderDao.findAll(Sort.by(Direction.DESC, "id"));
	}
    

	
	/*
	 * ------------------------- Post Mapping For Add Function
	 * ---------------------------------------
	 */

	/*
	 * creating post mapping to save customerOrder record when we click the add button in
	 * form
	 */
	// mapping name
	@PostMapping
	/*
	 * RequestBody eken frontend eke thiyena data eka backned eken ganna puluwan
	 * CustomerOrder - variable type
	 * customerOrder - variable / object
	 */
	public String save(@RequestBody CustomerOrder customerOrder) {

		// Authentication and Authorization

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Customer Order");

		if (!logUserPrivi.get("insert")) {
			return "Add is Not Completed  : You haven't Privilege";

		}

/** ----------------------------------------------Duplicate Check --------------------------------------------------------------------- */

		
/** ----------------------------------------------------- Set Next Number ---------------------------------------------------------- */


		// try catch eka use karanne db eken insert query eka weda netham ena error eka
		// exception eken thami catch karala message widhihata yawanne
		try {

			customerOrder.setAddeddatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			customerOrder.setAddeduser(loggeduser.getId());

			// create nextnumber variable to store nextnumber in db calling
			// geStringNextNumber() in customerOrderDao
			String nextNumber = customerOrderDao.getStringNextNumber();
			if (nextNumber.equals(null) || nextNumber.equals("")) {
				customerOrder.setCustomerorder_code("COd00001"); // empno auto generator
			} else {
				customerOrder.setCustomerorder_code(nextNumber);
			}

			//meka denna one to many relationship between porder -----> porderhasing
			for(CustomerOrderHasProduct cohp :customerOrder.getCustomerOrderHasProductList()){
				cohp.setCustomerorder_id(customerOrder);
			}
			
			
			// call operator
			customerOrderDao.save(customerOrder); // runs the insert query. methana id ekak neh enissa insert karala
								// therei.........
			// customerOrder is an entity object
			return "OK";
			// return "nextNumber" meka use karala alrt eke next enah record eke id eka
			// ganna puluwan
			// ekata js submit part eketh change karanna oneh.... look at the submit code

		} catch (Exception e) {
			return "Save is Not Completed :" + e.getMessage();
		}

	}

     @GetMapping(value = "/cordercodelist" , produces = "application/json")
	  public List<CustomerOrder> getCOcode(){
	  return customerOrderDao.getCOcodeList();
	}

		/*
	 * -------------------------------------Update Mapping
	 * -----------------------------------------------
	 */
	@PutMapping
	public String updateCOrder(@RequestBody CustomerOrder customerOrder) {
		// Authentication & Authrization

		
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Customer Order");

		if (!logUserPrivi.get("update")) {
			return "Update is  Not Completed  : You haven't Privilege";

		}

		/*------------------------- check existing and duplication ----------------------------------------*/

		// frontend eke thiyena id eka pass karanne getReferenceById ekata. yawana
		// object eka thiyenwadha kiyala balanne....
		CustomerOrder extCOrder = customerOrderDao.getReferenceById(customerOrder.getId());

		if (extCOrder == null) {
			return "Update Not Completed : CustomerOrder Not Exists....!";
		}
		// methanin eliyata yanawanam record eka db eke thiyenwa kiylai adhahas ganne


		try {
			// set auto generated value

			// operator
			customerOrder.setUpdatedatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			customerOrder.setAddeduser(loggeduser.getId());

			//meka denna one to many relationship between porder -----> porderhasing
			for(CustomerOrderHasProduct cohp :customerOrder.getCustomerOrderHasProductList()){
				cohp.setCustomerorder_id(customerOrder);
			}
			

			customerOrderDao.save(customerOrder); // meh save ekata id ekak thiyenawa. so meka update kiylaa BEnd ekata therei	}
			
			// dependecies

			return "OK";

		} catch (Exception e) {
			return "Update Not Completed :" + e.getMessage();
		}
	}

	/** ======================================================= Delete Function ==========================================================================================*/


	@DeleteMapping
	public String delete(@RequestBody CustomerOrder customerOrder
) {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "CustomerOrder");

		if (!logUserPrivi.get("delete")) {
			return "Delete is Not Completed  : You haven't Privilege";

		}
		
		// authentication and authorization

		// chcking whether the customerOrder
        //is existence or not
		CustomerOrder extCOrder = customerOrderDao.getReferenceById(customerOrder.getId()); // frontend eke thiyena object eke id eka pass
																		// karanne getReferenceById ekata

		try {

			if (extCOrder == null) {
				return "Delete Not Complete : CustomerOrder Not Exists....";
			}

			// operator

			// hard delete
			// customerOrderDao.delete(customerOrder

			/*
			 * fetches a reference to an customerOrder
 object based on its ID, and then deletes
			 * that customerOrder

			 * from the database using the DAO
			 * 
			 * id eka dunnama full object eka ganna puluwan
			 * 
			 * customerOrderDao.delete(customerOrderDao.getReferenceById(customerOrder
.getId()));
			 */

			// soft delete
			extCOrder.setCustomerorderstatus_id(customerOrderStatusDao.getReferenceById(4));// change status into delete

			// transaction 1 ......
			extCOrder.setDeletedatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			extCOrder.setDeleteuser(loggeduser.getId());
			customerOrderDao.save(extCOrder);// save extemp object(update)



			// transaction dekama complete wenakam delete eka wenne nah

			return "OK";

		} catch (Exception e) {
			return "Delete is Not Completed : " + e.getMessage();
		}
	}



	
	// get item list with supplier [/listwithoutsupplier/value what we want]
	@GetMapping(value = "/listbycorder/{cid}", produces = "application/json")
	public List<CustomerOrder> getCorderByCustomer(@PathVariable("cid") Integer cid) {

		return customerOrderDao.getCOrderListByCustomer(cid);
	}

}
