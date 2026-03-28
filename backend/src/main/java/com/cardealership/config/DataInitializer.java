package com.cardealership.config;

import com.cardealership.entity.User;
import com.cardealership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@cardeal.com")) {
            User admin = User.builder()
                    .name("Super Admin")
                    .email("admin@cardeal.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("9000000000")
                    .role(User.Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Default admin created: admin@cardeal.com / Admin@123");
        }
    }
}
