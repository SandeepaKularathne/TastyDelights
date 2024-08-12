package lk.tastydelights.report;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.tastydelights.employee.Employee;
import lk.tastydelights.purchaseorder.PurchaseOrder;

import java.util.List;

public interface ReportDao extends JpaRepository<Employee, Integer>{
    
    @Query(value = "select e from Employee e where e.employeestatus_id.id=1")
    List<Employee>WorkingEmployeeList();

    @Query(value = "select e from Employee e where e.employeestatus_id.id=?1 and e.designation_id.id=?2")
    List<Employee>employeeListByStatusDesignation(int status , int designation);

    @Query(value = "select new PurchaseOrder(po.pordercode) from PurchaseOrder po where po.purchaseorderstatus_id.id = 1")
    public List<PurchaseOrder> getPOrderList();

    @Query(value = "select po from PurchaseOrder po where po.purchaseorderstatus_id.id = 1 and po.supplier_id.id=?1")
    public List<PurchaseOrder> getPOrderListBySupplier(int status , int sid);

    @Query("SELECT new lk.tastydelights.report.ProductTypeCount(pt.name, COUNT(p.id)) FROM ProductType pt JOIN Product p ON p.producttype_id.id = pt.id GROUP BY pt.name")
    List<ProductTypeCount> getProductTypeCounts();









}
