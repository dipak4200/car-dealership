package com.cardealership.service;

import com.cardealership.dto.FinanceApplyRequest;
import com.cardealership.dto.FinanceCalculateRequest;
import com.cardealership.entity.Car;
import com.cardealership.entity.FinanceRequest;
import com.cardealership.entity.User;
import com.cardealership.repository.CarRepository;
import com.cardealership.repository.FinanceRequestRepository;
import com.cardealership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final FinanceRequestRepository financeRequestRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    /**
     * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
     * P = principal (loanAmount), r = monthly rate, n = term months
     */
    public Map<String, Object> calculate(FinanceCalculateRequest req) {
        BigDecimal loanAmount = req.getCarPrice().subtract(req.getDownPayment());
        if (loanAmount.compareTo(BigDecimal.ZERO) <= 0) {
            Map<String, Object> result = new HashMap<>();
            result.put("loanAmount", BigDecimal.ZERO);
            result.put("monthlyPayment", BigDecimal.ZERO);
            result.put("totalPayment", BigDecimal.ZERO);
            result.put("totalInterest", BigDecimal.ZERO);
            return result;
        }

        BigDecimal monthlyRate = req.getAnnualInterestRate()
                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
                .divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP);

        int n = req.getTermMonths();
        MathContext mc = new MathContext(10);

        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal onePlusRPowN = onePlusR.pow(n, mc);
        BigDecimal numerator = loanAmount.multiply(monthlyRate).multiply(onePlusRPowN);
        BigDecimal denominator = onePlusRPowN.subtract(BigDecimal.ONE);
        BigDecimal emi = numerator.divide(denominator, 2, RoundingMode.HALF_UP);

        BigDecimal totalPayment = emi.multiply(BigDecimal.valueOf(n)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalInterest = totalPayment.subtract(loanAmount).setScale(2, RoundingMode.HALF_UP);

        Map<String, Object> result = new HashMap<>();
        result.put("loanAmount", loanAmount.setScale(2, RoundingMode.HALF_UP));
        result.put("monthlyPayment", emi);
        result.put("totalPayment", totalPayment);
        result.put("totalInterest", totalInterest);
        return result;
    }

    public FinanceRequest applyForFinance(FinanceApplyRequest req, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Car car = carRepository.findById(req.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        BigDecimal loanAmount = req.getCarPrice().subtract(req.getDownPayment());

        FinanceRequest finReq = FinanceRequest.builder()
                .car(car)
                .user(user)
                .carPrice(req.getCarPrice())
                .downPayment(req.getDownPayment())
                .loanAmount(loanAmount)
                .termMonths(req.getTermMonths())
                .annualInterestRate(req.getAnnualInterestRate())
                .monthlyPayment(req.getMonthlyPayment())
                .status(FinanceRequest.Status.PENDING)
                .build();

        return financeRequestRepository.save(finReq);
    }

    public List<FinanceRequest> getUserFinanceRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return financeRequestRepository.findByUser(user);
    }
}
