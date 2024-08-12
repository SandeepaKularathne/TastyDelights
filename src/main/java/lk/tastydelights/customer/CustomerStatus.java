package lk.tastydelights.customer;

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


@Entity // convert into persistance entity
@Table(name =  "customerstatus") // for map with customerstatus table in db

@Data
@NoArgsConstructor
@AllArgsConstructor

public class CustomerStatus {

@Id //pk
@GeneratedValue(strategy = GenerationType.IDENTITY) //auto increment
@Column(name = "id" , unique = true)
private Integer id;

@Column(name = "name")
@NotNull
private String name;
    
}
