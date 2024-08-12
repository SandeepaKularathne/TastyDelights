package lk.tastydelights.privilege;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.tastydelights.user.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //convert into persistance entity
@Table (name = "privilege") //for map with employee db table

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Privilege {


    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AI
    @Column(name = "id") // property has to be written above the name 
    private Integer id;

    @Column(name = "priv_sel")
    @NotNull // use to indicate that these element cannot be null 
    private Boolean priv_sel;

    @Column(name = "priv_ins")
    @NotNull
    private Boolean priv_ins; 

    @Column(name = "priv_upd")
    @NotNull
    private Boolean priv_upd; 

    @Column(name = "priv_del")
    @NotNull
    private Boolean priv_del; 


    @ManyToOne
    @JoinColumn (name = "role_id" , referencedColumnName = "id")// relation eka many to one nissa joint column unah
    private Role role_id; 

    @ManyToOne
    @JoinColumn(name = "module_id" , referencedColumnName = "id")
    private Module module_id;
}
