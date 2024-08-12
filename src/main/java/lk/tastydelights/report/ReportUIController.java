package lk.tastydelights.report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.tastydelights.user.User;
import lk.tastydelights.user.UserDao;

@RestController
public class ReportUIController {

    @Autowired
    private UserDao userDao;
    	/*
	 * --------------------------- Mapping for UI interace
	 * ---------------------------------------
	 */
  
	@RequestMapping(value="/reportemployee")
	public ModelAndView reportWorkingEmployeeUI() {

		// get loged user authentication object using security context in webconfig file 
        //type object log wecha userge authentication object 

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getUserByUserName(auth.getName());

		ModelAndView employeeView = new ModelAndView();
		employeeView.addObject("title" , "Employee Management - Tasty Delights");
        employeeView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....
        employeeView.addObject("loggedUser" , auth.getName());
		employeeView.setViewName("reportemployee.html");
		return employeeView;
	}

	@RequestMapping(value="/reportpurchase")
	public ModelAndView reportPurchaseUI() {

		// get loged user authentication object using security context in webconfig file 
        //type object log wecha userge authentication object 

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getUserByUserName(auth.getName());

		ModelAndView employeeView = new ModelAndView();
		employeeView.addObject("title" , "Employee Management - Tasty Delights");
        employeeView.addObject("username", auth.getName()); // log wecha kenage username eka ganna puluwan.....

		employeeView.setViewName("reportpurchase.html");
		return employeeView;
	}

	@RequestMapping(value="/samplechart")
	public ModelAndView samplechartUI() {



        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.getUserByUserName(auth.getName());

		ModelAndView employeeView = new ModelAndView();
		employeeView.addObject("title" , "Product Type - Tasty Delights");
        employeeView.addObject("username", auth.getName());

		employeeView.setViewName("samplechart.html");
		return employeeView;
	}


}
