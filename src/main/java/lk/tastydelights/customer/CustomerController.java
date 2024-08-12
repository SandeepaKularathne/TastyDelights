package lk.tastydelights.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.tastydelights.privilege.PrivilegeController;
import lk.tastydelights.user.User;
import lk.tastydelights.user.UserDao;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController // make easier to work with data in a format suitable for web services
@RequestMapping(value = "/customer") // class level mapping. meka use karama mapping name value eka liyadhi /user
// eken patanganna oneh nah.
public class CustomerController {

	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the employeedao by using autowired so all the content
	// inside theemployee dao will connect with this file
	private CustomerDao dao;

	/* create Customerstatus instances */
	@Autowired
	private CustomerStatusDao customerStatusDao;

	@Autowired
	private PrivilegeController privilegeController;

	@Autowired
	private UserDao userDao;

	/*
	 * Autowired use karanne nethm meh option eken thmamai yanna oneh ----->>
	 * 
	 * public EmployeeController (EmployeeDao dao , EmployeeStatusDao
	 * employeeStatusDao){
	 * this.dao = dao;
	 * this.dao = employeeStatusDao;
	 * 
	 * }
	 */

	/*
	 * ================================== Mapping for UI
	 * interface===============================
	 */
	@RequestMapping
	public ModelAndView customerUI() {

		// get loged user authentication object using security context in webconfig file 
        //type object log wecha userge authentication object 

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		User loggedUser = userDao.getUserByUserName(auth.getName());

		ModelAndView customerView = new ModelAndView();
		customerView.addObject("title" , "Customer Management - Tasty Delights");
        customerView.addObject("loggedusername", auth.getName()); // log wecha kenage username eka ganna puluwan.....
        customerView.addObject("loggeduserrole", loggedUser.getRoles().iterator().next().getName()); // log wecha kenage 1st role eka ganna puluwan..... multiple roles thiboth 1st role ekai ganne
        customerView.addObject("loggeduserphoto", loggedUser.getPhotopath()); // log wecha kenage usern 4to eka ganna puluwan.....

		customerView.setViewName("customer.html");
		return customerView;
	}

	/*
	 * ====================================================define findall getmapping
	 * for all employee data --> URL(/employee/findall)
	 * ===============================================
	 */
	@RequestMapping(value = "/findall", produces = "application/json")
	public List<Customer> getallData() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");
		if (!logUserPrivi.get("select")){
		       return new ArrayList<>(); 
		}

		return dao.findAll(Sort.by(Direction.DESC, "id"));
	}

	/*
	 * =====================================PostMapping=============================
	 * ========
	 */

	/*
	 * RequestBody eken frontend eke thiyena data eka backned eken ganna puluwan
	 * Customer - variable type
	 * customer - variable / object
	 */
	@PostMapping
	public String save(@RequestBody Customer customer) {
        
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

		if (!logUserPrivi.get("insert")) {
			return "Add is  Not Completed  : You haven't Privilege";

		}


		/*
		 * --------------------------------Duplicate Check
		 * -------------------------------------------------------------------
		 */

		// duplicate (in our form email and nic are unique feild so when entering we
		// have to check duplication)

		Customer extCustomerEmail = dao.getByEmail(customer.getEmail());
		if (extCustomerEmail != null) {

			return "Save not Completed : " + customer.getEmail() + "Already Exists......";

		}

		Customer extCustomerMobile = dao.getByMobile(customer.getMobile());
		if (extCustomerMobile != null) {

			return "Save not Completed : " + customer.getMobile() + "Already Exists...."; // methana return wena eka
			/* text ekak nissa thamai uda String dhala thiyenne */
		}

		/*
		 * --------------------------------------- Add Next Number
		 * ------------------------------------------------------------------
		 */

		// try catch eka use karanne db eken insert query eka weda netham ena error eka
		// exception eken thami catch karala message widhihata yawanne
		try {

			customer.setAddeddatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			customer.setAddeduser(loggeduser.getId());
			// create nextnumber variable to store nextnumber in db calling
			// geStringNextNumber() in dao
			String nextNumber = dao.getStringNextNumber();
			if (nextNumber.equals(null) || nextNumber.equals("")) {
				customer.setCusno("Cus00001");
			} else {
				customer.setCusno(nextNumber);
			}

			// call operator
			dao.save(customer);
			// runs the insert query. methana id ekak neh enissa insert karala
			// therei.........
			// employee is an entity object

			return "OK";
			// return "nextNumber" meka use karala alrt eke next enah record eke id eka
			// ganna puluwan
			// ekata js submit part eketh change karanna oneh.... look at the submit code

		} catch (Exception e) {
			return "Save not Completed :" + e.getMessage();

		}

	}

	/*
	 * =======================================Delete Mapping
	 * =================================
	 */

	@DeleteMapping
	public String delete(@RequestBody Customer customer) {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

		if (!logUserPrivi.get("delete")) {
			return "Delete is  Not Completed  : You haven't Privilege";

		}
		// Authentication and Authorization

		// checking weather the customer is existing or not
		Customer extCustomer = dao.getReferenceById(customer.getId()); // frontend eke thiyena object eke id eka pass
																		// karanne getReferenceById ekata

		if (extCustomer == null) {
			return "Delete not Complete : Customer Not Exists.....!";
		}

		try {
			// operator

			// hard delete
			// dao.delete(customer);
			/*
			 * fetches a reference to an customer object based on its ID, and then deletes
			 * that customer
			 * from the database using the DAO
			 * 
			 * id eka dunnama full object eka ganna puluwan
			 * 
			 * dao.delete(dao.getReferenceById(customer.getId()));
			 */

			// soft delete
			extCustomer.setCustomerstatus_id(customerStatusDao.getReferenceById(2)); // change statsu into inactive

			// set deletedatetime
			extCustomer.setDeletedatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			customer.setDeleteuser(loggeduser.getId());

			dao.save(extCustomer); // save extCustomer object(update)

			return "OK";

		} catch (Exception e) {
			return "Delete is Not Completed : " + e.getMessage();
		}
	}

	/*
	 * ======================================== Put MApping
	 * ==============================
	 */

	@PutMapping
	public String updateCustomer(@RequestBody Customer customer) {

			// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Customer");

		if (!logUserPrivi.get("update")) {
			return "Update is  Not Completed  : You haven't Privilege";

		}

		// authentication & authorization

		/*
		 * ------------------------------------Check existing and duplication
		 * ---------------------------------------------
		 */

		// frontend eke thiyena id eka pass karanne getReferenceById ekata
		Customer exCustomer = dao.getReferenceById(customer.getId());

		if (exCustomer == null) {
			return "Update not Completed : Customer not Exists.....!";
		}

		// methanin eliyata yanawanam record eka db eke thiyenwa kiylai adhahas ganne

		// to check email - readability eka wedi.....
		Customer extCustomerByEmail = dao.getByEmail(customer.getEmail());
		if (extCustomerByEmail != null && extCustomerByEmail.getId() != customer.getId()) {

			return "Update Not Completed : Change" + customer.getEmail() + " Already Exists.....!";

		}

		try {
			// set auto generated value

			// oprator
			customer.setUpdatedatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			customer.setUpdateuser(loggeduser.getId());
			dao.save(customer);// meh save ekata id ekak thiyenawa. so meka update kiylaa BEnd ekata therei

			// dependencies

			return "OK";

		} catch (Exception e) {
			return "Update Not Completed :" + e.getMessage();
		}
	}

		/*
	 * =============================== create get mapping for get supplier list in Purchase order list ==================================================*/
	 
	@GetMapping(value = "/list" , produces = "application/json")
	public List<Customer> getListByActive(){
	  return dao.getActiveList();
	}

}
