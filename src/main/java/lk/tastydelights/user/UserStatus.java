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


@Entity //convert into persistance entity 
@Table(name = "userstatus") // for map with user db table



@Data //for generate setter and getter to string.... etc functions
@NoArgsConstructor //default constructor
@AllArgsConstructor //for generate all argument constructor

public class UserStatus {

@Id // as primary key
@GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment
@Column(name ="id",unique = true)
private Integer id;

@Column(name ="name")
private String name;

}
