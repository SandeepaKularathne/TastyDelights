package lk.tastydelights.ingredient;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// interface extends into jparepository <modalfile, datatype of pk>
public interface IngredientDao extends JpaRepository<Ingredient, Integer> {

    /* ------------------ Duplicate Check ------------------------- */

    @Query("Select i from Ingredient i where i.ingredientname = ?1")
    public Ingredient getByIngredientname(String ingredientname);

    /*-----------------------Add Next Number ----------------------------------------- */

    /*
     * query to get next number
     * if the empno is given as E001 then the query should be
     * concat, lpad, substring , max all function used in this query
     * (e.emp,2) means after the E 2nd letter should be start with lpad
     */

    @Query(value = "SELECT concat('Ing', lpad(substring(max(i.ingno), 4) + 1, 5, '0')) FROM tastydelights.ingredient AS i;", nativeQuery = true)
    // lapd() --------> its a function which used to access left side string
    public String getStringNextNumber();

    @Query(value = "select i from Ingredient i where i.ingredientstatus_id.id=1  and i.id not in (select shi.ingredient_id.id from SupplierHasIngredient shi where shi.supplier_id.id=?1)")
    public List<Ingredient> getListWithoutSupplier(Integer supplierid);

    // shi enitty name
    @Query("SELECT i FROM Ingredient i where i.id in (select shi.ingredient_id.id from SupplierHasIngredient shi where shi.supplier_id.id =?1)")
    public List<Ingredient> getIngredientsBySupplierName(Integer sid);

    // shi enitty name
    @Query("SELECT i FROM Ingredient i where i.id in (select pohi.ingredient_id.id from PurchaseOrderHasIngredient pohi where pohi.purchaseorder_id.pordercode =?1)")
    public List<Ingredient> getIngredientsByPOrderCode(String pocode);
}
