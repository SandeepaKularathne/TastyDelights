package lk.tastydelights.customerpayment;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;




@RestController // make easier to work with data in a format suitable for web services
@RequestMapping(value = "/cuspaymethod") // class level mapping. meka use karama mapping name value eka liyadhi /user eken patanganna oneh nah.
public class CusPaymentMethodController {

   
	// create Employeedao instance
	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the employeedao by using autowired so all the content
	// inside theemployee dao will connect with this file
	private CusPaymentMethodDao dao;


     /*
	 * -------------------------------- FindAll ------------------------------------------------
	 */
	// define findall get mapping for all employee data --> URL(/employee/findall)
	@RequestMapping(value = "/findall", produces = "application/json") // application/json eken content type eka thamai kiyanne ajax eke
	public List<CusPaymentMethod> getallData() {
		return dao.findAll();
	}


    
}
