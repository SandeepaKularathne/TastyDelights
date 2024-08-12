package lk.tastydelights.ingredientreceivenote;

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
import lk.tastydelights.purchaseorder.PurchaseOrder;
import lk.tastydelights.supplier.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //convert into persistance entity
@Table(name = "ingredientreceivenote") //for map with employee db table

@Data //for generate setter and getter to string.... etc functions
@NoArgsConstructor //default constructor
@AllArgsConstructor //for generate all argument constructor
public class IngredientReceiveNote {



@Id //as Primary Key
@GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment
@Column(name = "id", unique = true)
private Integer id;

@Column(name = "receivenote_no" , unique = true)
@NotNull
private String receivenote_no; 

@NotNull
private LocalDate received_date;

@NotNull
private String supplierbill_no; 

@NotNull
private BigDecimal total_amount;

@NotNull
private BigDecimal discount_rate;

@NotNull
private BigDecimal net_amount ;

@NotNull
private LocalDateTime addeddatetime;

private LocalDateTime updatedatetime;


private LocalDateTime deletedatetime;

@NotNull
private Integer adduser;

private Integer updateuser;

private Integer deleteuser;

@ManyToOne
@JoinColumn(name = "ingredientrecievenote_status_id" , referencedColumnName = "id")
private IRNStatus ingredientrecievenote_status_id;

@ManyToOne
@JoinColumn(name = "supplier_id" , referencedColumnName = "id")
private Supplier supplier_id;


@ManyToOne
@JoinColumn(name = "purchaseorder_id" , referencedColumnName = "id")
private PurchaseOrder purchaseorder_id;

//mapped eken read only write karanna bah 
//to write type eka maaru karanna oneh cascade ekata                         remove karanna 
@OneToMany(mappedBy = "ingredientreceivenote_id", cascade = CascadeType.ALL, orphanRemoval = true)
private List<IRNHasIngredient> irnHasIngredientList;

 //created a constructor ----> methanin selected object eka genaganna puluwan .......
 public IngredientReceiveNote(Integer id, String receivenote_no,BigDecimal total_amount ){
  this.id =id;
  this.receivenote_no = receivenote_no;
  this.total_amount = total_amount;
    
  }
  

  
}
