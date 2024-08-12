package lk.tastydelights.ingredientreceivenote;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


// interface extends into jparepository <modalfile, datatype of pk>
public interface IRNDao extends JpaRepository<IngredientReceiveNote, Integer> {

  /*-----------------------Add Next Number ----------------------------------------- */

  /*
   * query to get next number
   * if the empno is given as E001 then the query should be
   * concat, lpad, substring , max all function used in this query
   * (e.emp,2) means after the E 2nd letter should be start with lpad
   */

  @Query(value = "SELECT concat('Irn', lpad(substring(max(irn.receivenote_no), 4) + 1, 5, '0')) FROM tastydelights.ingredientreceivenote AS irn;", nativeQuery = true)
  // lapd() --------> its a function which used to access left side string
  public String getStringNextNumber();

  @Query(value = "select new IngredientReceiveNote(irn.id,irn.receivenote_no,irn.total_amount) from IngredientReceiveNote irn where irn.ingredientrecievenote_status_id.id = 1 and irn.supplier_id.id=?1")
  public List<IngredientReceiveNote> getIRNListBySupplier(Integer sid);

  // @Query(value = "select new IngredientReceiveNote(irn.id,irn.receivenote_no) from IngredientReceiveNote irn where irn.total_amount")
  // public List<IngredientReceiveNote> getTotalAmountByIRN();


}
