package lk.tastydelights.supplier;

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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/supplier")
public class SupplierController {

	// create Employeedao instance
	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the employeedao by using autowired so all the content
	// inside theemployee dao will connect with this file
	private SupplierDao dao;

	@Autowired
	private PrivilegeController privilegeController;


	@Autowired
	private SupplierStatusDao supplierStatusDao;
    
	/*================================== Ui ============================= */
     @RequestMapping
	 public ModelAndView supplierUI(){
   	// get loged user authentication object using security context in webconfig file 
    //type object log wecha userge authentication object 

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView supplierView = new ModelAndView();
		supplierView.addObject("title" , "Supplier Management- Tasty Delights");
        supplierView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....

		supplierView.setViewName("supplier.html");
		return supplierView;
	 }

	/*
	 * -------------------------------- FindAll ------------------------------------------------
	 */
	// define findall get mapping for all employee data --> URL(/employee/findall)
	@RequestMapping(value = "/findall", produces = "application/json") // application/json eken content type eka thamai kiyanne ajax eke
	public List<Supplier> getallData() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");
		if (!logUserPrivi.get("select")){
		       return new ArrayList<>(); 
		}

		return dao.findAll(Sort.by(Direction.DESC, "id"));
	}

/*
	 * ------------------------- Post Mapping For Add Function ---------------------------------------
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
	public String save(@RequestBody Supplier supplier) {

		
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

		if (!logUserPrivi.get("insert")) {
			return "Add is Not Completed  : You haven't Privilege";

		}

		/*
		 * --------------------------------Duplicate Check -------------------------------------------------------------------
		 */

		// duplicate (in our form email and nic are unique feild so when entering we
		// have to check duplication)
		Supplier extSupplierEmail = dao.getByEmail(supplier.getEmail());
		if (extSupplierEmail != null) {

			return "Save not completed : " + supplier.getEmail() + " already exist......!";
		}

		Supplier extSupplierMobile = dao.getByMobile(supplier.getMobile());
		if (extSupplierMobile != null) {
			// return "save not complete: Given email already exist";
			return "save not completed : " + supplier.getMobile() + " already exist......!"; // methana return wena eka
			/* text ekak nissa thamai uda String dhala thiyenne */
		}

		/*
		 * --------------------------------------- Add Next Number ------------------------------------------------------------------
		 */

		// try catch eka use karanne db eken insert query eka weda netham ena error eka
		// exception eken thami catch karala message widhihata yawanne
		try {

			supplier.setAddeddatetime(LocalDateTime.now());
			supplier.setAddeduser(1);

			// create nextnumber variable to store nextnumber in db calling
			// geStringNextNumber() in dao
			String nextNumber = dao.getStringNextNumber();
			if (nextNumber.equals(null) || nextNumber.equals("")) {
				supplier.setSupno("Sup00001"); // empno auto generator
			} else {
				supplier.setSupno(nextNumber);
			}

			// call operator
			dao.save(supplier); // runs the insert query. methana id ekak neh enissa insert karala
								// therei.........
			// employee is an entity object
			return "OK";
			// return "nextNumber" meka use karala alrt eke next enah record eke id eka
			// ganna puluwan
			// ekata js submit part eketh change karanna oneh.... look at the submit code

		} catch (Exception e) {
			return "Save Not Completed :" + e.getMessage();
		}

	}

		/*
	 * ---------------------------------------- Delete Mapping ----------------------------------------------
	 */

	 @DeleteMapping
	 public String delete(@RequestBody Supplier supplier) {

		
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

		if (!logUserPrivi.get("delete")) {
			return "Delete is Not Completed  : You haven't Privilege";

		}
 
		 // authentication and authorization
 
		 // chcking whether the supplier is existence or not
		 Supplier extSupplier = dao.getReferenceById(supplier.getId()); // frontend eke thiyena object eke id eka pass karanne getReferenceById ekata
		 
		 if (extSupplier == null) {
			 return "Delete Not Complete : Supplier Not Exists....";
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
			 extSupplier.setSupplierstatus_id(supplierStatusDao.getReferenceById(2));// change status into delete
 
			 extSupplier.setDeletedatetime(LocalDateTime.now());
			 extSupplier.setDeleteuser(1);
			 
			 dao.save(extSupplier);// save extemp object(update)
 
			 return "OK";
 
		 } catch (Exception e) {
			 return "Delete is Not Completed : " + e.getMessage();
		 }
	 }


	 /*
	 * -------------------------------------Update Mapping -----------------------------------------------
	 */
	@PutMapping
	@Transactional
	public String updateSupplier(@RequestBody Supplier supplier) {

		
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Supplier");

		if (!logUserPrivi.get("update")) {
			return "Update is Not Completed  : You haven't Privilege";

		}

		// Authentication & Authrization

		/*------------------------- check existing and duplication ------------------------*/

		// frontend eke thiyena id eka pass karanne getReferenceById ekata
		Supplier extSupplier = dao.getReferenceById(supplier.getId());

		if (extSupplier == null) {
			return "Update Not Completed : Supplier Not Exists....!";
		}
		// methanin eliyata yanawanam record eka db eke thiyenwa kiylai adhahas ganne

		// to check email - readability eka wedi.....
		Supplier extSupplierByEmail = dao.getByEmail(supplier.getEmail());
		if (extSupplierByEmail != null && extSupplierByEmail.getId() != supplier.getId()) {
			return "Update Not Completed : Change" + supplier.getEmail() + " Already Exists.....!";
		}

		// To check Mbile - readability eka wedi.....
		Supplier extSupplierByMobile = dao.getByMobile(supplier.getMobile());
		if (extSupplierByMobile != null && extSupplierByMobile.getId() != supplier.getId()) {

			return "Update not Completed : change " + supplier.getMobile() + " already exist.....! ";
		}

		try {
			// set auto generated value
           System.out.println(supplier);
			// operator
			supplier.setUpdatedatetime(LocalDateTime.now());
			supplier.setUpdateuser(1);
			dao.save(supplier); // meh save ekata id ekak thiyenawa. so meka update kiylaa BEnd ekata therei

			// dependecies

			return "OK";

		} catch (Exception e) {
			return "Update Not Completed :" + e.getMessage();
		}

	}


	/*
	 * =============================== create get mapping for get supplier list in Purchase order list ==================================================*/
	 
	@GetMapping(value = "/list" , produces = "application/json")
	public List<Supplier> getListByActive(){
	  return dao.getActiveList();
	}

	
	
 

}
