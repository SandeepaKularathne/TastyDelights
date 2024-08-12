package lk.tastydelights.customerpayment;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.tastydelights.customer.Customer;
import lk.tastydelights.customerorder.CustomerOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity //convert into persistance entity
@Table(name = "customerpayment") //for map with employee db table

@Data //for generate setter and getter to string.... etc functions
@NoArgsConstructor //default constructor
@AllArgsConstructor //for generate all argument constructor
public class CustomerPayment {


@Id //as Primary Key
@GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment
@Column(name = "id", unique = true)
private Integer id;

@Column(name = "billno" , unique = true)
@NotNull
private String billno; 


@NotNull
private BigDecimal totalamount;

@NotNull
private BigDecimal paidamount;


@NotNull
private BigDecimal balanceamount;


private Integer transfer_no;

private LocalDate tansfer_date;

private String note;

@NotNull
private LocalDateTime addeddatetime;

@NotNull
private Integer addeduser;

@ManyToOne
@JoinColumn(name = "cus_payment_method_id")
private CusPaymentMethod cus_payment_method_id ;


@ManyToOne
@JoinColumn(name = "customer_id")
private Customer customer_id;

@ManyToOne
@JoinColumn(name = "customerorder_id")
private CustomerOrder customerorder_id;


}
