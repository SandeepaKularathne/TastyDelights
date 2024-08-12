package lk.tastydelights.supplier;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.tastydelights.ingredient.Ingredient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity //convert into persistance entity
@Table(name = "supplier") //for map with employee db table

@Data //for generate setter and getter to string.... etc functions
@NoArgsConstructor //default constructor
@AllArgsConstructor //for generate all argument constructor


public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "supno" , unique = true)
    @NotNull
    private String supno;
    
    @NotNull
    private String companyname;
    
    @NotNull
    private String suppliername;
    
    @Column(name = "mobile" , unique = true)
    @NotNull
    private String mobile;
    
    @NotNull
    private String address;
    
    @Column(name = "email",unique = true)
    @NotNull
    private String email;
    
    private String accountno; 
    
    private String beneficiaryname; 
    
    private String bankname;
    
    private String branch;
    
    
    @NotNull
    private LocalDateTime addeddatetime;
    
    private LocalDateTime updatedatetime; 
    
    private LocalDateTime deletedatetime; 
    
    @NotNull
    private Integer addeduser;
    
    private Integer updateuser; 
    
   private Integer deleteuser;


   @ManyToOne
   @JoinColumn(name = "supplierstatus_id" , referencedColumnName = "id")
   private SupplierStatus supplierstatus_id;

   
    //user and role has many to many relationship....
    @ManyToMany(cascade = CascadeType.MERGE) //user and role dekama wena nissai 
    @JoinTable(name = "supplier_has_ingredient" , joinColumns  = @JoinColumn(name = "supplier_id"), inverseJoinColumns = @JoinColumn(name = "ingredient_id")) //table ekak join wena nissa 
    private Set<Ingredient>ingredients;

    //created a constructor ----> methanin selected object eka genaganna puluwan .......
    public Supplier(Integer id, String suppliername , String supno){
        this.id = id;
        this.suppliername = suppliername;
        this.supno = supno;
    }
}
