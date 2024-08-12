package lk.tastydelights.purchaseorder;

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

import jakarta.transaction.Transactional;
import lk.tastydelights.privilege.PrivilegeController;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController// make easier to work with data in a format suitable for web services
@RequestMapping(value = "/purchaseorder") // class level mapping. meka use karama mapping name value eka liyadhi /user
										// eken patanganna oneh nah.
public class PurchaseOrderController {

   // create Employeedao instance
	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the employeedao by using autowired so all the content
	// inside theemployee dao will connect with this file
    private PurchaseOrderDao dao;

	@Autowired
	private PrivilegeController privilegeController;

	@Autowired
	private PurchaseOrderStatusDao porderStatusDao;



    /** Autowired use karanne nethm meh option eken thmamai yanna oneh ----->>
	 
	   public EmployeeController (EmployeeDao dao , EmployeeStatusDao employeeStatusDao){
	   this.dao = dao;
	   this.dao = employeeStatusDao;
     }
	 */

	/** --------------------------- Mapping for UI interace ---------------------------------------**/

	 @RequestMapping
	public ModelAndView purchaseorderUI() {

		// get loged user authentication object using security context in webconfig file 
        //type object log wecha userge authentication object 

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView purchaseorderView = new ModelAndView();
		purchaseorderView.addObject("title" , "Purchase Order Management - Tasty Delights");
        purchaseorderView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....

		purchaseorderView.setViewName("purchaseorder.html");
		return purchaseorderView;
	}	


	 /*
	 * --------------------------- Find All ---------------------------------------
	 */
    @GetMapping(value = "/findall" , produces = "application/json")
    public List<PurchaseOrder>getAllData() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Purchase Order");
		if (!logUserPrivi.get("select")){
		       return new ArrayList<>(); 
		}

        return dao.findAll(Sort.by(Direction.DESC, "id"));
    }


	@GetMapping(value = "/list" , produces = "application/json")
	public List<PurchaseOrder> getListPOrder(){
	  return dao.getPOrderList();
	}

	
	@PostMapping
    /** RequestBody eken frontend eke thiyena data eka backned eken ganna puluwan
	 * Employee - variable type
	 * porder - variable / object */
    public String save(@RequestBody PurchaseOrder porder){
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Purchase Order");

		if (!logUserPrivi.get("insert")) {
			return "Add is Not Completed  : You haven't Privilege";

		}

		try {

			porder.setAddeddatetime(LocalDateTime.now());
			porder.setAddeduser(1);

			// create nextnumber variable to store nextnumber in db calling
			// geStringNextNumber() in dao
			String nextNumber = dao.getStringNextNumber();
			if (nextNumber.equals(null) || nextNumber.equals("")) {
				porder.setPordercode("PO00001"); // empno auto generator
			} else {
				porder.setPordercode(nextNumber);
			}

			//meka denna one to many relationship between porder -----> porderhasing
			for(PurchaseOrderHasIngredient pohi : porder.getPurchaseOrderHasIngredientList()) {
				pohi.setPurchaseorder_id(porder);
			}

			dao.save(porder);

			return "OK";
		} catch (Exception e) {

			return "Save Not Completed : " +e.getMessage();
		}

	
	}

/** -------------------------------------Update Mapping -----------------------------------------------**/
	@PutMapping
	public String updatePOrder(@RequestBody PurchaseOrder porder) {
		// Authentication & Authrization

		
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Purchase Order");

		if (!logUserPrivi.get("update")) {
			return "Update is  Not Completed  : You haven't Privilege";

		}

		/*------------------------- check existing and duplication ----------------------------------------*/

		// frontend eke thiyena id eka pass karanne getReferenceById ekata. yawana
		// object eka thiyenwadha kiyala balanne....
		PurchaseOrder extPurchaseOrder = dao.getReferenceById(porder.getId());

		if (extPurchaseOrder == null) {
			return "Update Not Completed : PurchaseOrder Not Exists....!";
		}
		// methanin eliyata yanawanam record eka db eke thiyenwa kiylai adhahas ganne


		try {
			// set auto generated value

			// operator
			porder.setUpdatedatetime(LocalDateTime.now());
			porder.setUpdateuser(1);

			
			//meka denna one to many relationship between porder -----> porderhasing
			for(PurchaseOrderHasIngredient pohi : porder.getPurchaseOrderHasIngredientList()) {
				pohi.setPurchaseorder_id(porder);
			}
			
			dao.save(porder); // meh save ekata id ekak thiyenawa. so meka update kiylaa BEnd ekata therei

			// check porder status and chnage user status
			// if (porder.getPurchaseorderstatus_id().getName().equals("Resigned")
			// 		|| porder.getEmployeestatus_id().getName().equals("Deleted")) {

			// 	User extUser = userdao.getUserByEmployee(porder.getId());
			// 	if (extUser != null) {
			// 		extUser.setStatus(false);
			// 		userdao.save(extUser);

			// 	}

			// 	if (porder.getEmployeestatus_id().getName().equals("Working")) {

			// 		User exUser = userdao.getUserByEmployee(porder.getId());
			// 		if (exUser != null) {
			// 			exUser.setStatus(true);
			// 			userdao.save(exUser);

			// 		}
			// 	}
			// }
			// dependecies

			return "OK";

		} catch (Exception e) {
			return "Update Not Completed :" + e.getMessage();
		}
	}


	
	@Transactional // meken transaction manage wenama system automatically rollback wei mokak hari
					// problem ekak aawoth
	@DeleteMapping
	public String delete(@RequestBody PurchaseOrder porder) {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Purchase Order");

		if (!logUserPrivi.get("delete")) {
			return "Delete is Not Completed  : You haven't Privilege";

		}
		
		// authentication and authorization

		// chcking whether the employee is existence or not
		PurchaseOrder extPOrder = dao.getReferenceById(porder.getId()); // frontend eke thiyena object eke id eka pass
																		// karanne getReferenceById ekata

		try {

			if (extPOrder == null) {
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
			extPOrder.setPurchaseorderstatus_id(porderStatusDao.getReferenceById(3));// change status into delete

			// transaction 1 ......
			extPOrder.setDeletedatetime(LocalDateTime.now());
			extPOrder.setDeleteuser(1);

			dao.save(extPOrder);// save extemp object(update)

			// transaction dekama complete wenakam delete eka wenne nah

			return "OK";

		} catch (Exception e) {
			return "Delete is Not Completed : " + e.getMessage();
		}
	}

	
	// get item list with supplier [/listwithoutsupplier/value what we want]
	@GetMapping(value = "/listbyporderstatus/{sid}", produces = "application/json")
	public List<PurchaseOrder> getPorderBySupplier(@PathVariable("sid") Integer sid) {

		return dao.getPOrderListBySupplier(sid);
	}

    
}
