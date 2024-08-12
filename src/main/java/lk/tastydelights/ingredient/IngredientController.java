package lk.tastydelights.ingredient;

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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/ingredient")
public class IngredientController {

	// create Employeedao instance
	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the employeedao by using autowired so all the content
	// inside theemployee dao will connect with this file
	private IngredientDao dao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private IngredientStatusDao ingredientstatusDao;

	@Autowired
	private PrivilegeController privilegeController;

	/*
	 * ===================================== UI Mapping
	 * =============================================================
	 */
	@RequestMapping
	public ModelAndView ingredientUI() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		ModelAndView ingredientView = new ModelAndView();
		ingredientView.addObject("title", "Ingredient Management - Tasty Delights");
		ingredientView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....

		ingredientView.setViewName("ingredient.html");
		return ingredientView;
	}

	/*
	 * =================================== FindAll Mapping
	 * =============================================================
	 */
	// define findall get mapping for all employee data --> URL(/employee/findall)
	@RequestMapping(value = "/findall", produces = "application/json") // application/json eken content type eka thamai
																		// kiyanne ajax eke

	public List<Ingredient> getallData() {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
				"Ingredient");
		if (!logUserPrivi.get("select")) {
			return new ArrayList<>();
		}

		return dao.findAll(Sort.by(Direction.DESC, "id"));
	}

	/*
	 * ===================== Ingredient List
	 * =============================================================
	 */
	@GetMapping(value = "/list", produces = "application/json")
	public List<Ingredient> ingredientList() {
		return dao.findAll();
	}

	/*
	 * ========================================= Post Mapping
	 * ============================================================
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
	public String save(@RequestBody Ingredient ingredient) {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
				"Ingredient");

		if (!logUserPrivi.get("insert")) {
			return "Add is Not Completed  : You haven't Privilege";

		}

		/*--------------------------- Duplicate Check ----------------------------------- */

		Ingredient extIngredientName = dao.getByIngredientname(ingredient.getIngredientname());

		if (extIngredientName != null) {

			return "Save not Completed : " + ingredient.getIngredientname() + "Already Exists....";
			
		}

		/*
		 * --------------------------------------- Add Next Number
		 * ------------------------------------------------------------------
		 */

		// try catch eka use karanne db eken insert query eka weda netham ena error eka
		// exception eken thami catch karala message widhihata yawanne
		try {

			ingredient.setAddeddatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			ingredient.setAddeduser(loggeduser.getId());



			// create nextnumber variable to store nextnumber in db calling
			// geStringNextNumber() in dao
			String nextNumber = dao.getStringNextNumber();
			if (nextNumber.equals(null) || nextNumber.equals("")) {
				ingredient.setIngno("Ing00001"); // empno auto generator
			} else {
				ingredient.setIngno(nextNumber);
			}

			// call operator
			dao.save(ingredient); // runs the insert query. methana id ekak neh enissa insert karala
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
	 * ========================= Delete Mapping
	 * ===============================================
	 */

	@DeleteMapping
	public String delete(@RequestBody Ingredient ingredient) {

		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
				"Ingredient");

		if (!logUserPrivi.get("delete")) {
			return "Delete is Not Completed  : You haven't Privilege";

		}

		// authentication and authorization

		// chcking whether the employee is existence or not
		Ingredient extIngredient = dao.getReferenceById(ingredient.getId()); // frontend eke thiyena object eke id eka
																				// pass karanne getReferenceById ekata

		if (extIngredient == null) {
			return "Delete Not Complete : Employee Not Exists....";
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
			extIngredient.setIngredientstatus_id(ingredientstatusDao.getReferenceById(2));// change status into delete

			extIngredient.setDeletedatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			ingredient.setDeleteuser(loggeduser.getId());

			dao.save(extIngredient);// save extemp object(update)

			return "OK";

		} catch (Exception e) {
			return "Delete is Not Completed : " + e.getMessage();
		}
	}

	/*
	 * -------------------------------------Update Mapping
	 * -----------------------------------------------
	 */
	@PutMapping
	public String updateEmployee(@RequestBody Ingredient ingredient) {
				// Authentication & Authrization


		// get loged user authentication object using security context in webconfig file
		// type object log wecha userge authentication object
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		HashMap<String, Boolean> logUserPrivi = privilegeController.getPrivilegeByUserModule(auth.getName(),
				"Ingredient");

		if (!logUserPrivi.get("update")) {
			return "Update is Not Completed  : You haven't Privilege";

		}


		/*------------------------- check existing and duplication ------------------------*/

		// frontend eke thiyena id eka pass karanne getReferenceById ekata
		Ingredient extIngredient = dao.getReferenceById(ingredient.getId());

		if (extIngredient == null) {
			return "Update Not Completed : Ingredient Not Exists....!";
		}
		// methanin eliyata yanawanam record eka db eke thiyenwa kiylai adhahas ganne

		try {
			// set auto generated value

			// operator
			ingredient.setUpdatedatetime(LocalDateTime.now());
			User loggeduser = userDao.getUserByUserName(auth.getName());
			ingredient.setUpdateuser(loggeduser.getId());
			dao.save(ingredient); // meh save ekata id ekak thiyenawa. so meka update kiylaa BEnd ekata therei

			// dependecies

			return "OK";

		} catch (Exception e) {
			return "Update Not Completed :" + e.getMessage();
		}

	}

	// get item list without supplier [/listwithoutsupplier/value what we want]
	@GetMapping(value = "/listwithoutsupplier/{supid}", produces = "application/json")
	public List<Ingredient> getListWithoutSupplier(@PathVariable("supid") Integer supplierid) {

		return dao.getListWithoutSupplier(supplierid);
	}

	// get item list with supplier [/listwithoutsupplier/value what we want]
	@GetMapping(value = "/listbyingredient/{sid}", produces = "application/json")
	public List<Ingredient> getIngredientsFromSupplier(@PathVariable("sid") Integer sid) {

		return dao.getIngredientsBySupplierName(sid);
	}

	@GetMapping(value = "/listbypocode/{pocode}", produces = "application/json")
	public List<Ingredient> getIngredientsFromPOrderCode(@PathVariable("pocode") String pocode) {

		return dao.getIngredientsByPOrderCode(pocode);
	}




}
