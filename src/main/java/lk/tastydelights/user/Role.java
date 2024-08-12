package lk.tastydelights.user;

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
@Table(name = "role")

@Data //for generate setter and getter to string.... etc functions
@NoArgsConstructor //default constructor
@AllArgsConstructor //for generate all argument constructor

public class Role {
      

@Id // as primary Key
@GeneratedValue(strategy = GenerationType.IDENTITY)//Auto Increment
@Column(name ="id",unique = true)
private Integer id;

@Column(name ="name")
private String name;

}
