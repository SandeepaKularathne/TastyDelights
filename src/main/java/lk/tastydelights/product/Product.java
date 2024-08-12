package lk.tastydelights.product;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "product")

@Data // to generate getter and setter for the string.......etc function
@NoArgsConstructor // default constructor
@AllArgsConstructor // generate all argument constructor 

public class Product {

    @Id // Pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AutoIncrement
    @Column(name = "", unique = true)
    private Integer id;

    @Column(name = "productname")
    @NotNull
    private String productname;

    @Column(name = "productcode", unique = true)
    @NotNull
    private String productcode;

    @Column(name = "weight") 
    @NotNull
    private BigDecimal weight;
    
    @Column(name = "price" )
    @NotNull
    private BigDecimal price;

    @Column(name = "design")
    private byte[] design;

    @Column(name = "designname")
    private String designname;

    @Column(name="note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "producttype_id", referencedColumnName = "id")
    private ProductType producttype_id;

    
    @Column(name = "addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime; 
   
    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime; 
    

    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;
    

    @Column(name = "addeduser")
    @NotNull
    private Integer addeduser;
    

    @Column(name = "deleteuser")
    private Integer deleteuser;
    

    @Column(name = "updateuser")
    private Integer updateuser;

    @ManyToOne
    @JoinColumn(name = "flavour_id", referencedColumnName = "id")
    private ProductFlavour flavour_id;

    @ManyToOne
    @JoinColumn(name = "productstatus_id", referencedColumnName = "id")
    private ProductStatus productstatus_id;

    
//mapped eken read only write karanna bah 
//to write type eka maaru karanna oneh cascade ekata 
@OneToMany(mappedBy = "product_id", cascade = CascadeType.ALL)
private List<ProductHasIngredient> productHasIngredientList;


}
