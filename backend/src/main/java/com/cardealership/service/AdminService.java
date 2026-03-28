package com.cardealership.service;

import com.cardealership.dto.AddVendorRequest;
import com.cardealership.entity.User;
import com.cardealership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User addVendor(AddVendorRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User vendor = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(User.Role.VENDOR)
                .enabled(true)
                .build();
        return userRepository.save(vendor);
    }

    public List<User> getAllVendors() {
        return userRepository.findByRole(User.Role.VENDOR);
    }

    public User toggleVendor(Long vendorId) {
        User vendor = userRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        if (vendor.getRole() != User.Role.VENDOR) {
            throw new RuntimeException("User is not a vendor");
        }
        vendor.setEnabled(!vendor.isEnabled());
        return userRepository.save(vendor);
    }
}
