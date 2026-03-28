package com.cardealership.dto;

import lombok.Data;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Data
public class CarRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String make;

    @NotBlank
    private String model;

    @NotNull @Min(1900)
    private Integer year;

    @NotNull @DecimalMin("0.01")
    private BigDecimal price;

    private Integer mileage;
    private String fuelType;
    private String transmission;
    private String color;

    @Size(max = 2000)
    private String description;

    private String imageUrl;
}
