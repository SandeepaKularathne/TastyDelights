package lk.tastydelights.product;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/phi")
public class ProductHasIngredientController {

    @Autowired
    private ProductHasIngredientDao productHasIngredientDao;

    @GetMapping(value = "/listbyphi" ,params = {"product"},produces = "application/json")
    private List <ProductHasIngredient>getIngQtyByPHI(@RequestParam("product")int product){
        return productHasIngredientDao.getingquantitylist(product);

    }
    
}
