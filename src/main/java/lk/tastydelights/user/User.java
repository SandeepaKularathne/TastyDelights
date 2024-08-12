package lk.tastydelights.user;

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
import lk.tastydelights.employee.Employee;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;


@Entity //convert into persistance entity
@Table(name = "user") //for map with user db

@Data //for generate setter and getter to string.... etc functions
@NoArgsConstructor //default constructor
@AllArgsConstructor //for generate all argument constructor
public class User {
    
    @Id //as pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name ="id")
    private Integer id;
    
    @Column(name ="username")
    @NotNull
    private String username;
    
    @Column(name ="password")
    @NotNull
    private String password; 
    
    @Column(name ="email",unique = true)
    @NotNull
    private String email; 
    
    @Column(name ="status")
    @NotNull
    private Boolean status;
    
    @Column(name ="note")
    private String note; 
    
    @Column(name ="addeddatetime")
    @NotNull
    private LocalDateTime addeddatetime;

    @Column(name = "updatedatetime")
    private LocalDateTime updatedatetime;
    
    @Column(name = "deletedatetime")
    private LocalDateTime deletedatetime;
    
    @Column(name = "addeduser")
    @NotNull
    private Integer addeduser;

    @Column
    private Integer updateuser;

    @Column(name = "deleteuser")
    private Integer deleteuser;
    
    @Column(name ="photopath")
    private byte[]  photopath;

    @Column(name = "designname")
    private String designname;
    
    @ManyToOne  // user--> employee table relationship many to one 
    @JoinColumn(name ="employee_id", referencedColumnName = "id")
    private Employee employee_id;


    //user and role has many to many relationship....
    @ManyToMany(cascade = CascadeType.MERGE) //user and role dekama wena nissai 
    @JoinTable(name = "user_has_role" , joinColumns  = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id")) //table ekak join wena nissa 
    private Set<Role> roles;

}
