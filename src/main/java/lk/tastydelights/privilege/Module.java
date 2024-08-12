package lk.tastydelights.privilege;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "module")

@Data //for generate setter and getter to string.... etc functions
@NoArgsConstructor //default constructor
@AllArgsConstructor //for generate all argument constructor

public class Module {
      

@Id // as primary Key
@GeneratedValue(strategy = GenerationType.IDENTITY)//Auto Increment
@Column(name ="id",unique = true)
private Integer id;

/* id ekata not null demme nethe mekata wenawama ui ekak hadhnawanam or option add karanna oneh unoth ui hadhanakota 
 not null thiboth data pass karanna bari wei db ekata
 */

@Column(name ="name")
private String name;

}
