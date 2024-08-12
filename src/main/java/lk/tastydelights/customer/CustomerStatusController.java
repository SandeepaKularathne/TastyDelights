package lk.tastydelights.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/customerstatus") // class level mapping. meka use karama mapping name value eka liyadhi /designation
public class CustomerStatusController {

    // create EmployeeStatusDao instance
	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the EmployeeStatusDao by using autowired so all the content
	// inside the EmployeeStatusDao will connect with this file
    private CustomerStatusDao dao;
    

    @GetMapping(value = "/findall" , produces = "application/json")
    public List<CustomerStatus>getAllData(){
        return dao.findAll();
    }
}
