package lk.tastydelights.production;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.tastydelights.customerorder.CustomerOrder;
import lk.tastydelights.product.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity //convert into persistance entity
@Table(name = "production") //for map with employee db table

@Data //for generate setter and getter to string.... etc functions
@NoArgsConstructor //default constructor
@AllArgsConstructor//for generate all argument constructor
public class Production {


@Id //as Primary Key
@GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment
@Column(name = "id" , unique = true)
private Integer id;

@NotNull
private LocalDateTime addeddatetime; 

@NotNull
private Integer addeduser; 

private Integer ordered_qty;

private String completed_qty;

private LocalDateTime completed_datetime; 

private Integer completed_user; 

@ManyToOne
@JoinColumn(name = "product_id" , referencedColumnName = "id")
private Product product_id;

@ManyToOne
@JoinColumn(name = "customerorder_id" , referencedColumnName = "id")
private CustomerOrder customerorder_id; 


}
