package lk.tastydelights.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.tastydelights.ingredientreceivenote.IngredientReceiveNote;
import lk.tastydelights.privilege.PrivilegeController;
import lk.tastydelights.purchaseorder.PurchaseOrder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping(value = "/product") // class level mapping. meka use karama mapping name value eka liyadhi
									// /designation
public class ProductController {

	// create Employeedao instance
	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the employeedao by using autowired so all the content
	// inside theemployee dao will connect with this file
	private ProductDao dao;

	/* create ProductStatusDao instances */
	@Autowired
	private ProductStatusDao productStatusDao;

	@Autowired
	private PrivilegeController privilegeController;

	/*
	 * =================================== mapping for UI interface
	 * ==========================================
	 */
	@RequestMapping
	public ModelAndView productUI() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView productView = new ModelAndView();
		productView.addObject("title", "Product Management- Tasty Delights");
		productView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....

		productView.setViewName("product.html");
		return productView;

	}

	/*
	 * =============================================== Findall
	 * ==========================================
	 */
	// define findall get mapping for all employee data --> URL(/employee/findall)
	@RequestMapping(value = "/findall", produces = "application/json")
	public List<Product> getallData() {
		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Product");
		if (!logUserPrivi.get("select")) {
			return new ArrayList<>();
		}

		return dao.findAll(Sort.by(Direction.DESC, "id"));
	}

	/*
	 * ======================================= Post Mapping
	 * =============================================================================
	 * =======
	 */

	/*
	 * creating post mapping to save product record when we click the add button in
	 * form
	 */
	// mapping name

	@PostMapping
	/*
	 * RequestBody eken frontend eke thiyena data eka backned eken ganna puluwan
	 * Employee - variable type
	 * employee - variable / object
	 */
	public String save(@RequestBody Product product) {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

		if (!logUserPrivi.get("insert")) {
			return "Add is Not Completed  : You haven't Privilege";

		}

		/*--------------------------  Duplication Check -------------------------------------------- */

		Product extProductName = dao.getByProductName(product.getProductname());
		if (extProductName != null) {
			// return "save not complete: Given email already exist";
			return "save not completed : " + product.getProductname() + " already exist......!"; // methana return wena
																									// eka
			/* text ekak nissa thamai uda String dhala thiyenne */
		}

		/*
		 * --------------------------------------- Add Next Number
		 * -----------------------------------------------------
		 */

		// try catch eka use karanne db eken insert query eka weda netham ena error eka
		// exception eken thami catch karala message widhihata yawanne

		try {

			product.setAddeddatetime(LocalDateTime.now());
			product.setAddeduser(1);

			// create nextnumber variable to store nextnumber in db calling
			// geStringNextNumber() in dao

			String nextNumber = dao.getStringNextNumber();
			if (nextNumber.equals(null) || nextNumber.equals("")) {
				product.setProductcode("Pro00001"); // auto generator
			} else {
				product.setProductcode(nextNumber);
			} // call operator

			// meka denna one to many relationship between product -----> producthasing
			for (ProductHasIngredient proitem : product.getProductHasIngredientList()) {
				proitem.setProduct_id(product);
			}

			dao.save(product); // runs the insert query. methana id ekak neh enissa insert karala
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
	 * ========================================= Delete Mapping
	 * ============================================================================
	 */

	@DeleteMapping
	public String delete(@RequestBody Product product) {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

		if (!logUserPrivi.get("delete")) {
			return "Delete is Not Completed  : You haven't Privilege";

		}

		// authentication and authorization

		// chcking whether the product is existence or not

		Product extProduct = dao.getReferenceById(product.getId()); // frontend eke thiyena object eke id eka pass
																	// karanne getReferenceById ekata

		if (extProduct == null) {
			return "Delete not Complete : Product not Exists......!";
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
			extProduct.setProductstatus_id(productStatusDao.getReferenceById(2)); // change status into not available

			extProduct.setDeletedatetime(LocalDateTime.now());
			extProduct.setDeleteuser(1);

			dao.save(extProduct);

			return "OK";

		} catch (Exception e) {
			return "Delete is Not Completed : " + e.getMessage();
		}
	}

	/*
	 * ===================================== Put Mapping
	 * =============================================================================
	 */
	@PutMapping
	public String updateProduct(@RequestBody Product product) {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(), "Product");

		if (!logUserPrivi.get("update")) {
			return "Update is Not Completed  : You haven't Privilege";

		}

		// Authentication & Authorization

		/*------------------------------------- check existing and duplication ----------------------------------  */

		// frontend eke thiyena id eka pass karanne getReferenceById ekata
		Product extProduct = dao.getReferenceById(product.getId());
		if (extProduct == null) {
			return "Update not Completed : Product not Exists.....! ";
		}

		// methanin eliyata yanawanam record eka db eke thiyenwa kiylai adhahas ganne

		try {
			// set auto generaeted value

			// operator
			product.setUpdatedatetime(LocalDateTime.now());
			product.setUpdateuser(1);

			
			// meka denna one to many relationship between product -----> producthasing
			for (ProductHasIngredient proitem : product.getProductHasIngredientList()) {
				proitem.setProduct_id(product);
			}
			
			dao.save(product);// meh save ekata id ekak thiyenawa. so meka update kiylaa BEnd ekata therei

			return "OK";

		} catch (Exception e) {
			return "Update Not Completed :" + e.getMessage();
		}

	}

	/*
	 * ===================== Product List
	 * =============================================================
	 */
	@GetMapping(value = "/list", produces = "application/json")
	public List<Product> productList() {
		return dao.findAll();
	}

	//get item list with supplier [/listwithoutsupplier/value what we want]
	@GetMapping(value = "/listbycorder/{coid}", produces = "application/json")
	public List<Product> getProductListByCOrder(@PathVariable("coid")Integer coid) {

		return dao.getProductNameByCOrder(coid);
	}

}