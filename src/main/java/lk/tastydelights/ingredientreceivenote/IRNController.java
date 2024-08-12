package lk.tastydelights.ingredientreceivenote;

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
import lk.tastydelights.ingredient.Ingredient;
import lk.tastydelights.ingredient.IngredientDao;
import lk.tastydelights.ingredient.StockDetail;
import lk.tastydelights.ingredient.StockDetailDao;
import lk.tastydelights.privilege.PrivilegeController;
import lk.tastydelights.purchaseorder.PurchaseOrder;
import lk.tastydelights.purchaseorder.PurchaseOrderDao;
import lk.tastydelights.purchaseorder.PurchaseOrderHasIngredient;
import lk.tastydelights.purchaseorder.PurchaseOrderStatusDao;
import lk.tastydelights.user.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController // make easier to work with data in a format suitable for web services
@RequestMapping(value = "/irn") // class level mapping. meka use karama mapping name value eka liyadhi /user
								// eken patanganna oneh nah.
public class IRNController {

	// create Employeedao instance
	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the employeedao by using autowired so all the content
	// inside theemployee irnDao will connect with this file
	private IRNDao irnDao;

	@Autowired
	private IRNStatusDao irnStatusDao;

	@Autowired
	private PrivilegeController privilegeController;

	@Autowired
	private StockDetailDao stockDetailDao;

	@Autowired
	private PurchaseOrderDao pOrderDao;

	@Autowired
	private PurchaseOrderStatusDao purchaseOrderStatusDao;

	@Autowired
	private IngredientDao ingredientDao;

	/*
	 * Autowired use karanne nethm meh option eken thmamai yanna oneh ----->>
	 * 
	 * public EmployeeController (EmployeeDao irnDao , EmployeeStatusDao
	 * employeeStatusDao){
	 * this.irnDao = irnDao;
	 * this.irnDao = employeeStatusDao;
	 * 
	 * }
	 */

	/**
	 * --------------------------- Mapping for UI interace
	 * ---------------------------------------
	 **/

	@RequestMapping
	public ModelAndView irnUI() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView irnView = new ModelAndView();
		irnView.addObject("title", "Ingredient Receive Note - Tasty Delights");
		irnView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....

		irnView.setViewName("irn.html");
		return irnView;

	}

	/**
	 * --------------------------- Find All ---------------------------------------
	 **/
	@GetMapping(value = "/findall", produces = "application/json")
	public List<IngredientReceiveNote> getAllData() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "IRN");
		if (!logUserPrivi.get("select")) {
			return new ArrayList<>();
		}

		return irnDao.findAll(Sort.by(Direction.DESC, "id"));
	}

	// @GetMapping(value = "/list", produces = "application/json")
	// public List<String> getListByReceive() {
	// return irnDao.getReceivedList();
	// }

	@PostMapping
  /*
	 * RequestBody eken frontend eke thiyena data eka backned eken ganna puluwan
	 * Employee - variable type
	 * irn - variable / object
	 */
    public String save(@RequestBody IngredientReceiveNote irn) {

        // Authentication & Authorization
		
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "IRN");

		if (!logUserPrivi.get("insert")) {
			return "Add is  Not Completed  : You haven't Privilege";

		}
        // duplication

        

        try {

			irn.setAddeddatetime(LocalDateTime.now());
			// User loggeduser = userDao.getUserByUserName(auth.getName());
			// irn.setAddeduser(loggeduser.getId());

				// create nextnumber variable to store nextnumber in db calling
			// geStringNextNumber() in irnDao
			String nextNumber = irnDao.getStringNextNumber();
			if (nextNumber.equals(null) || nextNumber.equals("")) {
				irn.setReceivenote_no("Irn00001"); // empno auto generator
			} else {
				irn.setReceivenote_no(nextNumber);
			}


            // set auto generated value
          for(IRNHasIngredient irnHasIngredient : irn.getIrnHasIngredientList()){
			irnHasIngredient.setIngredientreceivenote_id(irn);
		  }


            // opertaion
          IngredientReceiveNote newirn =  irnDao.save(irn);


			//need to update ingredient stock ...............

			for(IRNHasIngredient irnHasIngredient : newirn.getIrnHasIngredientList()){
		         Ingredient ingredient = ingredientDao.getReferenceById(irnHasIngredient.getIngredient_id().getId());
				 ingredient.setCostperunit(irnHasIngredient.getUnitprice());
				 ingredientDao.save(ingredient);

				 StockDetail extStock = stockDetailDao.getByIngredient(ingredient.getId(),irnHasIngredient.getExpiry_date());
				 if(extStock !=null){
					extStock.setAvailable_quantity(extStock.getAvailable_quantity().add(irnHasIngredient.getQuantity()));
					extStock.setTotal_quantity(extStock.getTotal_quantity().add(irnHasIngredient.getQuantity()));

					stockDetailDao.save(extStock);

				 }else{
					StockDetail newStockDetail = new StockDetail();
					newStockDetail.setIngredient_id(ingredient);
					newStockDetail.setExpire_date(irnHasIngredient.getExpiry_date());
              
					newStockDetail.setAvailable_quantity(irnHasIngredient.getQuantity());
					newStockDetail.setTotal_quantity(irnHasIngredient.getQuantity());
					stockDetailDao.save(newStockDetail);

					

				 }

			}

			
			if (newirn.getPurchaseorder_id() !=null) {
				PurchaseOrder porder = pOrderDao.getReferenceById(newirn.getPurchaseorder_id().getId());
				porder.setPurchaseorderstatus_id(purchaseOrderStatusDao.getReferenceById(2));

				//meka denna one to many relationship between porder -----> porderhasing
			for(PurchaseOrderHasIngredient pohi : porder.getPurchaseOrderHasIngredientList()) {
				pohi.setPurchaseorder_id(porder);
			}

			pOrderDao.save(porder);
				
			}




            return "OK";
        } catch (Exception e) {
            return "Save Not Completed : " + e.getMessage();
        }
    }

	/**
	 * -------------------------------------Update Mapping
	 * -----------------------------------------------
	 **/
	@PutMapping
	public String updateIrn(@RequestBody IngredientReceiveNote irn) {
		// Authentication & Authrization

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "IRN");

		if (!logUserPrivi.get("update")) {
			return "Update is  Not Completed  : You haven't Privilege";

		}

		/*------------------------- check existing and duplication ----------------------------------------*/

		// frontend eke thiyena id eka pass karanne getReferenceById ekata. yawana
		// object eka thiyenwadha kiyala balanne....
		IngredientReceiveNote extIrn = irnDao.getReferenceById(irn.getId());

		if (extIrn == null) {
			return "Update Not Completed : IngredientReceiveNote Not Exists....!";
		}
		// methanin eliyata yanawanam record eka db eke thiyenwa kiylai adhahas ganne

		try {
			// set auto generated value

			// operator
			irn.setUpdatedatetime(LocalDateTime.now());
			irn.setUpdateuser(1);

			// meka denna one to many relationship between irn -----> porderhasing
			for (IRNHasIngredient irnHasIngredient : irn.getIrnHasIngredientList()) {
				irnHasIngredient.setIngredientreceivenote_id(irn);
			}
			irnDao.save(irn); // meh save ekata id ekak thiyenawa. so meka update kiylaa BEnd ekata therei

			// check irn status and chnage user status
			// if (irn.getPurchaseorderstatus_id().getName().equals("Resigned")
			// || irn.getEmployeestatus_id().getName().equals("Deleted")) {

			// User extUser = userdao.getUserByEmployee(irn.getId());
			// if (extUser != null) {
			// extUser.setStatus(false);
			// userdao.save(extUser);

			// }

			// if (irn.getEmployeestatus_id().getName().equals("Working")) {

			// User exUser = userdao.getUserByEmployee(irn.getId());
			// if (exUser != null) {
			// exUser.setStatus(true);
			// userdao.save(exUser);

			// }
			// }
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
	public String delete(@RequestBody IngredientReceiveNote irn) {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "IRN");

		if (!logUserPrivi.get("delete")) {
			return "Delete is Not Completed  : You haven't Privilege";

		}

		// authentication and authorization

		// chcking whether the employee is existence or not
		IngredientReceiveNote extIrn = irnDao.getReferenceById(irn.getId()); // frontend eke thiyena object eke id eka
																				// pass
		// karanne getReferenceById ekata

		try {

			if (extIrn == null) {
				return "Delete Not Complete : Employee Not Exists....";
			}

			// operator

			// hard delete
			// irnDao.delete(employee);
			/*
			 * fetches a reference to an employee object based on its ID, and then deletes
			 * that employee
			 * from the database using the DAO
			 * 
			 * id eka dunnama full object eka ganna puluwan
			 * 
			 * irnDao.delete(irnDao.getReferenceById(employee.getId()));
			 */

			// soft delete
			extIrn.setIngredientrecievenote_status_id(irnStatusDao.getReferenceById(3));// change status into delete

			// transaction 1 ......
			extIrn.setDeletedatetime(LocalDateTime.now());
			extIrn.setDeleteuser(1);

			for (IRNHasIngredient irnHasIngredient : irn.getIrnHasIngredientList()) {
				irnHasIngredient.setIngredientreceivenote_id(irn);
			}

			irnDao.save(extIrn);// save extemp object(update)

			// transaction dekama complete wenakam delete eka wenne nah

			return "OK";

		} catch (Exception e) {
			return "Delete is Not Completed : " + e.getMessage();
		}
	}

	// get item list with supplier [/listwithoutsupplier/value what we want]
	@GetMapping(value = "/listbyirn/{sid}", produces = "application/json")
	public List<IngredientReceiveNote> getIRNBySupplier(@PathVariable("sid") Integer sid) {

		return irnDao.getIRNListBySupplier(sid);
	}

}
