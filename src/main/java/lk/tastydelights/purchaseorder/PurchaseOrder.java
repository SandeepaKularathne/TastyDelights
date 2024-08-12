package lk.tastydelights.purchaseorder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
import lk.tastydelights.supplier.Supplier;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Entity  //convert into persistance entity 
@Table(name = "purchaseorder") //for map with employeestatus table db

@Data //for generate getter and setter to string ..... etc functions
@NoArgsConstructor // default consrtructor
@AllArgsConstructor // generate all argument constructor
public class PurchaseOrder {

@Id // Pk
@GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
@Column(name = "id")
private Integer id;

@Column(name = "pordercode" )
@NotNull
private String pordercode;

@Column(name = "requireddate")
@NotNull
private LocalDate requireddate;

@Column(name = "totalamount" )
@NotNull
private BigDecimal totalamount;

@Column(name = "note" )
private String note;

@Column(name =  "addeddatetime")
@NotNull
private LocalDateTime addeddatetime; 

@Column(name = "deletedatetime" )
private LocalDateTime deletedatetime;

@Column(name = "updatedatetime")
private LocalDateTime updatedatetime;

@Column(name ="addeduser")
@NotNull
private Integer addeduser;

@Column(name = "deleteuser")
private Integer deleteuser;

@Column(name = "updateuser" )
private Integer updateuser;


@ManyToOne
@JoinColumn(name = "purchaseorderstatus_id" , referencedColumnName = "id")
private PurchaseOrderStatus purchaseorderstatus_id;


@ManyToOne
@JoinColumn(name = "supplier_id" , referencedColumnName = "id")
private Supplier supplier_id;

//mapped eken read only write karanna bah 
//to write type eka maaru karanna oneh cascade ekata 
@OneToMany(mappedBy = "purchaseorder_id", cascade = CascadeType.ALL)
private List<PurchaseOrderHasIngredient> purchaseOrderHasIngredientList;



 //created a constructor ----> methanin selected object eka genaganna puluwan .......
 public PurchaseOrder(Integer id , String pordercode ){
  this.id = id;
  this.pordercode = pordercode;
}

    
}
