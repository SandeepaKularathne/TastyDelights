package lk.tastydelights.employee;

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

import jakarta.transaction.Transactional;
import lk.tastydelights.privilege.PrivilegeController;
import lk.tastydelights.user.User;
import lk.tastydelights.user.UserDao;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController // make easier to work with data in a format suitable for web services
@RequestMapping(value = "/employee") // class level mapping. meka use karama mapping name value eka liyadhi /user
										// eken patanganna oneh nah.

public class EmployeeController {

	// create Employeedao instance
	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the employeedao by using autowired so all the content
	// inside theemployee dao will connect with this file
	private EmployeeDao dao;

	@Autowired
	private UserDao userDao;

	/* create EmployeeStatusdao instances */
	@Autowired
	private EmployeeStatusDao employeeStatusDao;

	@Autowired
	private PrivilegeController privilegeController;

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
	 * --------------------------- Mapping for UI interace
	 * ---------------------------------------
	 */
	@RequestMapping
	public ModelAndView employeeUI() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		User loggedUser = userDao.getUserByUserName(auth.getName());

		ModelAndView employeeView = new ModelAndView();
		employeeView.addObject("title", "Employee Management - Tasty Delights");
		employeeView.addObject("loggedusername", auth.getName()); // log wecha kenage username eka ganna puluwan.....
		employeeView.addObject("loggeduserrole", loggedUser.getRoles().iterator().next().getName()); // log wecha kenage 1st role eka ganna puluwan.....                                                         multiple roles thiboth 1st role ekai ganne
		employeeView.addObject("loggeduserphoto", loggedUser.getPhotopath()); // log wecha kenage usern 4to eka ganna puluwan.....

		employeeView.setViewName("employee.html");
		return employeeView;
	}

	/*
	 * -------------------------------- FindAll
	 * ------------------------------------------------
	 */
	// define findall get mapping for all employee data --> URL(/employee/findall)
	@RequestMapping(value = "/findall", produces = "application/json") // application/json eken content type eka thamai
																		// kiyanne ajax eke
	public List<Employee> getallData() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
				"Employee");
		if (!logUserPrivi.get("select")) {
			return new ArrayList<>();
		}

		return dao.findAll(Sort.by(Direction.DESC, "id"));
	}

	/*
	 * ------------------------- Post Mapping For Add Function
	 * ---------------------------------------
	 */

	/*
	 * creating post mapping to save employee record when we click the add button in
	 * form
	 */
	// mapping name
	@PostMapping
	/*
	 * RequestBody eken frontend eke thiyena data eka backned eken ganna puluwan
	 * Employee - variable type
	 * employee - variable / object
	 */
	public String save(@RequestBody Employee employee) {

		// Authentication and Authorization

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
				"Employee");

		if (!logUserPrivi.get("insert")) {
			return "Add is Not Completed  : You haven't Privilege";

		}

		/**
		 * ------------------------------------------- Duplicate Check
		 * -----------------------------------------------------------------
		 */

		// duplicate (in our form email and nic are unique feild so when entering we
		// have to check duplication)
		Employee extEmployeeEmail = dao.getByEmail(employee.getEmail());
		if (extEmployeeEmail != null) {

			return "Save not completed : " + employee.getEmail() + "is already exist......!";
		}

		Employee extEmployeeNic = dao.getByNic(employee.getNic());
		if (extEmployeeNic != null) {
			// return "save not complete: Given email already exist";
			return "save not completed : " + employee.getNic() + " already exist......!"; // methana return wena eka
			/* text ekak nissa thamai uda String dhala thiyenne */
		}
		/**
		 * --------------------------------------------------------Set Next Number *
		 * ----------------------------------------------------------------------------------------
		 */

		// try catch eka use karanne db eken insert query eka weda netham ena error eka
		// exception eken thami catch karala message widhihata yawanne
		try {

			employee.setAddeddatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			employee.setAddeduser(loggeduser.getId());
			// create nextnumber variable to store nextnumber in db calling
			// geStringNextNumber() in dao
			String nextNumber = dao.getStringNextNumber();
			if (nextNumber.equals(null) || nextNumber.equals("")) {
				employee.setEmpno("Emp00001"); // empno auto generator
			} else {
				employee.setEmpno(nextNumber);
			}

			// call operator
			dao.save(employee); // runs the insert query. methana id ekak neh enissa insert karala
								// therei.........
			// employee is an entity object
			return "OK";
			// return "nextNumber" meka use karala alrt eke next enah record eke id eka
			// ganna puluwan
			// ekata js submit part eketh change karanna oneh.... look at the submit code

		} catch (Exception e) {
			return "Save is Not Completed :" + e.getMessage();
		}

	}

	/**
	 * ======================================================= Delete Function
	 * ==========================================================
	 */

	@Transactional // meken transaction manage wenama system automatically rollback wei mokak hari
					// problem ekak aawoth
	@DeleteMapping
	public String delete(@RequestBody Employee employee) {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
				"Employee");

		if (!logUserPrivi.get("delete")) {
			return "Delete is Not Completed  : You haven't Privilege";

		}

		// authentication and authorization

		// chcking whether the employee is existence or not
		Employee extEmployee = dao.getReferenceById(employee.getId()); // frontend eke thiyena object eke id eka pass
																		// karanne getReferenceById ekata

		try {

			if (extEmployee == null) {
				return "Delete Not Complete : Employee Not Exists....";
			}

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
			extEmployee.setEmployeestatus_id(employeeStatusDao.getReferenceById(3));// change status into delete

			// transaction 1 ......
			extEmployee.setDeletedatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			employee.setDeleteuser(loggeduser.getId());

			dao.save(extEmployee);// save extemp object(update)

			// transaction 2....
			// need to inactive user status when we delete an employee

			// check employee status and chnage user status


				User extUser = userDao.getUserByEmployee(extEmployee.getId());
				if (extUser != null) {
					extUser.setStatus(false);
					userDao.save(extUser);

				}
		
			// transaction dekama complete wenakam delete eka wenne nah

			return "OK";

		} catch (Exception e) {
			return "Delete is Not Completed : " + e.getMessage();
		}
	}

	/**
	 * --------------------------------------------- Update Mapping
	 * -----------------------------------------------------------
	 */

	@PutMapping
	public String updateEmployee(@RequestBody Employee employee) {
		// Authentication & Authrization

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
				"Employee");

		if (!logUserPrivi.get("update")) {
			return "Update is  Not Completed  : You haven't Privilege";

		}

		/*------------------------- check existing and duplication ----------------------------------------*/

		// frontend eke thiyena id eka pass karanne getReferenceById ekata. yawana
		// object eka thiyenwadha kiyala balanne....
		Employee extEmployee = dao.getReferenceById(employee.getId());

		if (extEmployee == null) {
			return "Update Not Completed : Employee Not Exists....!";
		}
		// methanin eliyata yanawanam record eka db eke thiyenwa kiylai adhahas ganne

		// to check email - readability eka wedi.....
		Employee extEmployeeByEmail = dao.getByEmail(employee.getEmail());
		if (extEmployeeByEmail != null && extEmployeeByEmail.getId() != employee.getId()) {
			return "Update Not Completed : Change" + employee.getEmail() + " Already Exists.....!";
		}

		// To check NIC - readability eka wedi.....
		Employee extEmployeeByNic = dao.getByNic(employee.getNic());
		if (extEmployeeByNic != null && extEmployeeByNic.getId() != employee.getId()) {

			return "Update not Completed : change " + employee.getNic() + " already exist.....! ";
		}

		try {
			// set auto generated value

			// operator
			employee.setUpdatedatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			employee.setUpdateuser(loggeduser.getId());
			dao.save(employee); // meh save ekata id ekak thiyenawa. so meka update kiylaa BEnd ekata therei

			// check employee status and chnage user status
			if (employee.getEmployeestatus_id().getName().equals("Resigned")
					|| employee.getEmployeestatus_id().getName().equals("Deleted")) {

				User extUser = userDao.getUserByEmployee(employee.getId());
				if (extUser != null) {
					extUser.setStatus(false);
					userDao.save(extUser);

				}

				if (employee.getEmployeestatus_id().getName().equals("Working")) {

					User exUser = userDao.getUserByEmployee(employee.getId());
					if (exUser != null) {
						exUser.setStatus(true);
						userDao.save(exUser);

					}
				}
			}
			// dependecies

			return "OK";

		} catch (Exception e) {
			return "Update Not Completed :" + e.getMessage();
		}
	}

	/*
	 * =============================== create get mapping for get employee list
	 * without user account ==================================================
	 */
	@GetMapping(value = "/listbywithoutuseraccount", produces = "application/json")
	public List<Employee> getListByWithoutUserAccount() {
		return dao.getEmployeeListWithoutUserAccount();
	}
}
