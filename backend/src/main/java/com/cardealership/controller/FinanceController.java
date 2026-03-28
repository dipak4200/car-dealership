package com.cardealership.controller;

import com.cardealership.dto.FinanceApplyRequest;
import com.cardealership.dto.FinanceCalculateRequest;
import com.cardealership.entity.FinanceRequest;
import com.cardealership.service.FinanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    // Public EMI calculate
    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculate(@Valid @RequestBody FinanceCalculateRequest request) {
        return ResponseEntity.ok(financeService.calculate(request));
    }

    // User apply for finance
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/apply")
    public ResponseEntity<FinanceRequest> apply(@Valid @RequestBody FinanceApplyRequest request,
                                                  Authentication auth) {
        return ResponseEntity.ok(financeService.applyForFinance(request, auth.getName()));
    }

    // User view their finance requests
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my-requests")
    public ResponseEntity<List<FinanceRequest>> myRequests(Authentication auth) {
        return ResponseEntity.ok(financeService.getUserFinanceRequests(auth.getName()));
    }
}
