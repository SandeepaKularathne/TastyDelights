package lk.tastydelights.customerpayment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CusPaymentMethodDao extends JpaRepository<CusPaymentMethod, Integer>{
    
}