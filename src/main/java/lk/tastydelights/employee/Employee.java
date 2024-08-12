package lk.tastydelights.employee;

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


@Entity //convert into persistance entity
@Table(name = "employee") //for map with employee db table

@Data //for generate setter and getter to string.... etc functions
@NoArgsConstructor //default constructor
@AllArgsConstructor //for generate all argument constructor
public class Employee {
    

    @Id //as Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment
    @Column(name = "id", unique = true)
    private Integer id;
    
    @Column(name = "empno", unique = true)
    @NotNull
    private String empno;
    
    @Column(name = "fullname")
    @NotNull
    private String fullname;
    
    @Column(name = "callingname")
    @NotNull
    private String callingname;

    @Column(name = "nic", unique = true)
    @NotNull
    private String nic;
    
    @Column(name = "gender")
    @NotNull
    private String gender; 
    
    @Column(name = "dob")
    @NotNull
    private LocalDate dob;

    
    @Column(name = "design")
    private byte[] design;

    @Column(name = "designname")
    private String designname;

    @Column(name = "mobile")
    @NotNull
    private String mobile; 
    
    @Column(name = "mobile2")
    private String mobile2;

    @Column(name = "email" , unique = true)
    @NotNull
    private String email;
    
    @Column(name = "address")
    @NotNull
    private String address;
    
    @Column(name = "note")
    private String note; 

    @Column(name = "civilstatus")
    @NotNull
    private String civilstatus;

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


    @ManyToOne // employee--> employeeStatus table relationship many to one 
    @JoinColumn (name = "employeestatus_id", referencedColumnName = "id")
    private EmployeeStatus employeestatus_id; // FK ----> another table PK
    

    @ManyToOne // employee ---> designation table relationship mant to one
    @JoinColumn (name = "designation_id" , referencedColumnName = "id")
    private Designation designation_id;
}
