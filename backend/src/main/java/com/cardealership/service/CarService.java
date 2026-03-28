package com.cardealership.service;

import com.cardealership.dto.CarRequest;
import com.cardealership.entity.Car;
import com.cardealership.entity.User;
import com.cardealership.repository.CarRepository;
import com.cardealership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    // Public
    public List<Car> getAllAvailableCars() {
        return carRepository.findByAvailableTrue();
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
    }

    public List<Car> searchCars(String query) {
        return carRepository.findByMakeContainingIgnoreCaseOrModelContainingIgnoreCase(query, query);
    }

    // Vendor operations
    public List<Car> getVendorCars(String vendorEmail) {
        User vendor = userRepository.findByEmail(vendorEmail)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        return carRepository.findByVendor(vendor);
    }

    public Car addCar(CarRequest request, String vendorEmail) {
        User vendor = userRepository.findByEmail(vendorEmail)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        Car car = Car.builder()
                .title(request.getTitle())
                .make(request.getMake())
                .model(request.getModel())
                .year(request.getYear())
                .price(request.getPrice())
                .mileage(request.getMileage())
                .fuelType(request.getFuelType())
                .transmission(request.getTransmission())
                .color(request.getColor())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .available(true)
                .vendor(vendor)
                .build();
        return carRepository.save(car);
    }

    public Car updateCar(Long carId, CarRequest request, String vendorEmail) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (!car.getVendor().getEmail().equals(vendorEmail)) {
            throw new RuntimeException("You don't own this car listing");
        }

        car.setTitle(request.getTitle());
        car.setMake(request.getMake());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setPrice(request.getPrice());
        car.setMileage(request.getMileage());
        car.setFuelType(request.getFuelType());
        car.setTransmission(request.getTransmission());
        car.setColor(request.getColor());
        car.setDescription(request.getDescription());
        car.setImageUrl(request.getImageUrl());
        return carRepository.save(car);
    }

    public void deleteCar(Long carId, String vendorEmail) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (!car.getVendor().getEmail().equals(vendorEmail)) {
            throw new RuntimeException("You don't own this car listing");
        }
        carRepository.delete(car);
    }
}
