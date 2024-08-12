package lk.tastydelights.customerpayment;

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


@Entity //convert into persistance entity 
@Table(name = "cus_payment_method") //for map with employeestatus table db


@Data //for generate setter and getter to string.... etc functions
@NoArgsConstructor //default constructor
@AllArgsConstructor //for generate all argument constructor

public class CusPaymentMethod {
    
@Id // PK
@GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment
@Column(name ="id",unique = true)
private Integer id;

@Column(name ="name")
@NotNull
private String name;

}


