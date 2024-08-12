package lk.tastydelights.report;

import lk.tastydelights.customer.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.tastydelights.customer.CustomerStatus;
import lk.tastydelights.employee.Employee;
import lk.tastydelights.purchaseorder.PurchaseOrder;

import java.util.List;

@RestController
public class ReportDataController {

    @Autowired
    private ReportDao reportDao;

    //[/reportdataworkingemployee] testing method
    @GetMapping(value = "/reportdataworkingemployee", produces = "application/json")
    private List<Employee> getWorkingEmployeeList(){
        return reportDao.WorkingEmployeeList();

    }

    
    //[/reportdataemployee?status=1&designation=1] testing method
    @GetMapping(value = "/reportdataemployee",params = {"status","designation"}, produces = "application/json")
    private List<Employee> getWorkingEmployeeListByStatusDesignation(@RequestParam("status")int status, @RequestParam("designation")int designation){
        return reportDao.employeeListByStatusDesignation(status,designation);

    }

      //[/reportdataworkingemployee] testing method
      @GetMapping(value = "/reportdatareqporder", produces = "application/json")
      private List<PurchaseOrder> POrderList(){
          return reportDao.getPOrderList();
  
      }
  

     //[/reportdataporder?status=1&sid=1] testing method
     @GetMapping(value = "/reportdataporder",params = {"status","sid"}, produces = "application/json")
     private List<PurchaseOrder>POrderListBySupplier(@RequestParam("status")int status, @RequestParam("sid")int sid){
         return reportDao.getPOrderListBySupplier(status,sid);
 
     }

    @GetMapping(value = "/reportproducttypecount", produces = "application/json")
    public List<ProductTypeCount> getProductTypeCount() {
        return reportDao.getProductTypeCounts();
    }






}
