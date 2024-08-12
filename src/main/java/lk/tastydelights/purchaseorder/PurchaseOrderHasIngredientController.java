package lk.tastydelights.purchaseorder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/pohi")
public class PurchaseOrderHasIngredientController {

    @Autowired
    private PurchaseOrderHasIngredientDao purchaseOrderHasIngredientDao;

    @GetMapping(value = "/listBypohi",params = {"ingredient","purchaseorder"}, produces = "application/json")
    private PurchaseOrderHasIngredient getingredientBYPoHI(@RequestParam("ingredient")int ingredient , @RequestParam("purchaseorder")int purchaseorder){
        return purchaseOrderHasIngredientDao.getpohiList(ingredient,purchaseorder);
    }
    
}
