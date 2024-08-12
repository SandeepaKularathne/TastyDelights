package lk.tastydelights.customerorder;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lk.tastydelights.product.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // convert into persistance entity
@Table(name = "customerorder_has_product") // for map with employeestatus table db

@Data // for generate getter and setter to string ..... etc functions
@NoArgsConstructor // default consrtructor
@AllArgsConstructor // generate all argument constructor
public class CustomerOrderHasProduct {

    @Id // Pk
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "customerorder_id", referencedColumnName = "id")
    @JsonIgnore // meken forign key eken pass karana data eka blk karanna puluwan. ehema blk
                // karanne nethm StackOverflowError ekak pass wenawa.... recursion 1kak balapana
                // nissa
    private CustomerOrder customerorder_id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product_id;

    @Column(name = "product_price")
    @NotNull
    private BigDecimal product_price;

    @Column(name = "lineprice")
    @NotNull
    private BigDecimal lineprice;

    @Column(name = "quantity")
    @NotNull
    private Integer quantity;

    @Column(name = "note")
    private String note;

    // created a constructor ----> methanin selected object eka genaganna puluwan
    // .......
    public CustomerOrderHasProduct(Integer id) {
        this.id = id;
    }
}
