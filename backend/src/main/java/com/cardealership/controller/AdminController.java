package com.cardealership.controller;

import com.cardealership.dto.AddVendorRequest;
import com.cardealership.entity.User;
import com.cardealership.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/vendors")
    public ResponseEntity<User> addVendor(@Valid @RequestBody AddVendorRequest request) {
        return ResponseEntity.ok(adminService.addVendor(request));
    }

    @GetMapping("/vendors")
    public ResponseEntity<List<User>> getAllVendors() {
        return ResponseEntity.ok(adminService.getAllVendors());
    }

    @PutMapping("/vendors/{id}/toggle")
    public ResponseEntity<User> toggleVendor(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleVendor(id));
    }
}
