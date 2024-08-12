package lk.tastydelights.purchaseorder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity  //convert into persistance entity 
@Table(name = "purchaseorderstatus") //for map with employeestatus table db

@Data //for generate getter and setter to string ..... etc functions
@NoArgsConstructor // default consrtructor
@AllArgsConstructor // generate all argument constructor

public class PurchaseOrderStatus {

    @Id // Pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //autoincrement
    @Column(name = "id" , unique = true)
    private Integer id;

    @Column(name = "name")
    @NotNull
    private String name;
    
}
