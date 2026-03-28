package com.cardealership.controller;

import com.cardealership.dto.CarRequest;
import com.cardealership.entity.Car;
import com.cardealership.service.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor")
@PreAuthorize("hasRole('VENDOR')")
@RequiredArgsConstructor
public class VendorController {

    private final CarService carService;

    @GetMapping("/cars")
    public ResponseEntity<List<Car>> getMyCars(Authentication auth) {
        return ResponseEntity.ok(carService.getVendorCars(auth.getName()));
    }

    @PostMapping("/cars")
    public ResponseEntity<Car> addCar(@Valid @RequestBody CarRequest request, Authentication auth) {
        return ResponseEntity.ok(carService.addCar(request, auth.getName()));
    }

    @PutMapping("/cars/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id,
                                         @Valid @RequestBody CarRequest request,
                                         Authentication auth) {
        return ResponseEntity.ok(carService.updateCar(id, request, auth.getName()));
    }

    @DeleteMapping("/cars/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id, Authentication auth) {
        carService.deleteCar(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
