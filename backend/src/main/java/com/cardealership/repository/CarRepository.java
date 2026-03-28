package com.cardealership.repository;

import com.cardealership.entity.Car;
import com.cardealership.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByVendor(User vendor);
    List<Car> findByAvailableTrue();
    List<Car> findByMakeContainingIgnoreCaseOrModelContainingIgnoreCase(String make, String model);
}
