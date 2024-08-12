package lk.tastydelights.customer;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity // convert into persistant entity 
@Table(name = "customer") // for map with custmer  table in db

@Data // for generate setter and getter to string ---- etc functions
@NoArgsConstructor // default constructor
@AllArgsConstructor // for generate all argument constructor
public class Customer {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY) // Autoincrement
@Column(name = "id" ,unique = true)    
private Integer id;

@Column(name = "cusno", unique = true)
@NotNull
private String cusno;

@Column(name = "firstname")
@NotNull
private String firstname;

@Column(name = "lastname" )
@NotNull
private String lastname;

@Column(name = "email" , unique = true)
@NotNull
private String email;

@Column(name = "mobile", unique = true)
@NotNull
private String mobile;

@Column(name = "address")
@NotNull
private String address;

@Column(name = "dob")
@NotNull
private LocalDate dob;

@Column(name = "note")
private String note; 

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

@ManyToOne // customer <----> customerStatus table relationship 
@JoinColumn(name = "customerstatus_id" , referencedColumnName = "id")
private CustomerStatus customerstatus_id;
    

 //created a constructor ----> methanin selected object eka genaganna puluwan .......
 public Customer(Integer id, String firstname , String lastname ,String cusno, String mobile){
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.cusno = cusno;
    this.mobile = mobile;
}
}
