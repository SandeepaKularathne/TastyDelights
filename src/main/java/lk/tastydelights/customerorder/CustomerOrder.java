package lk.tastydelights.customerorder;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.tastydelights.customer.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // convert into persistant entity 
@Table(name = "customerorder") // for map with custmer  table in db

@Data // for generate setter and getter to string ---- etc functions
@NoArgsConstructor // default constructor
@AllArgsConstructor // for generate all argument constructor
public class CustomerOrder {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY) //autoincrement 
@Column(name = "id" , unique = true)
private Integer id;

@Column(name = "customerorder_code")
@NotNull
private String customerorder_code;

@Column(name = "requireddate")
@NotNull
private LocalDate requireddate;

@Column(name = "note")
private String note; 

@Column(name = "totalamount")
@NotNull
private BigDecimal totalamount;

@Column (name = "advanced_payment")
private BigDecimal advanced_payment;

@Column(name = "balanceamount")
@NotNull
private BigDecimal balanceamount;

@Column(name = "addeddatetime")
@NotNull
private LocalDateTime addeddatetime; 

@Column(name =  "updatedatetime")
private LocalDateTime updatedatetime;

@Column(name = "deletedatetime")
private LocalDateTime deletedatetime; 

@Column (name = "addeduser")
@NotNull
private Integer addeduser; 

@Column
private Integer deleteuser;

@Column
private Integer updateuser;

@ManyToOne
@JoinColumn(name = "customerorderstatus_id" , referencedColumnName = "id")
private CustomerOrderStatus customerorderstatus_id;

//mapped eken read only write karanna bah 
//to write type eka maaru karanna oneh cascade ekata 
@OneToMany(mappedBy = "customerorder_id", cascade = CascadeType.ALL)
private List<CustomerOrderHasProduct> customerOrderHasProductList;


@ManyToOne
@JoinColumn(name = "customer_id" , referencedColumnName = "id")
private Customer customer_id;

//created a constructor ----> methanin selected object eka genaganna puluwan .......
public CustomerOrder(Integer id , String customerorder_code ,BigDecimal totalamount){
    this.id = id;
    this.customerorder_code = customerorder_code;
    this.totalamount  = totalamount;
  }
    
}
