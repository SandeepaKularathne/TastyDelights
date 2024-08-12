package lk.tastydelights.ingredient;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@RequestMapping(value = "/stockdetail")
public class StockDetailController {

    // create Employeedao instance
	@Autowired // a way to get things it needs wihout having to create them itself.
	// here we are injecting the employeedao by using autowired so all the content
	// inside theemployee dao will connect with this file
    private StockDetailDao dao;
    

    /*===================================== UI Mapping ============================================================= */
     @RequestMapping
	 public ModelAndView stockdetailUI(){


		ModelAndView stockdetailView = new ModelAndView(); 
		stockdetailView.setViewName("stockdetail.html");
		return stockdetailView;
	 }

     
	 /*=================================== FindAll Mapping ============================================================= */
	 // define findall get mapping for all employee data --> URL(/employee/findall)
	@RequestMapping(value = "/findall" , produces = "application/json")  // application/json eken content type eka thamai kiyanne ajax eke

	public List<StockDetail>getallData(){
		return dao.findAll(Sort.by(Direction.DESC, "id"));
	}
}
