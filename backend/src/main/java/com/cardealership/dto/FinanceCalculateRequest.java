package com.cardealership.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Data
public class FinanceCalculateRequest {
    @NotNull @DecimalMin("0")
    private BigDecimal carPrice;

    @NotNull @DecimalMin("0")
    private BigDecimal downPayment;

    @NotNull @DecimalMin("0.1")
    private BigDecimal annualInterestRate;

    @NotNull @Min(6) @Max(84)
    private Integer termMonths;
}
