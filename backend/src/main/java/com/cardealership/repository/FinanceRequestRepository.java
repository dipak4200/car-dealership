package com.cardealership.repository;

import com.cardealership.entity.FinanceRequest;
import com.cardealership.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FinanceRequestRepository extends JpaRepository<FinanceRequest, Long> {
    List<FinanceRequest> findByUser(User user);
}
