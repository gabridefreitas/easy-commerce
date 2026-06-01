package com.easycommerce.server.order;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CheckoutRequest(
                @NotBlank String name,
                @Email @NotBlank String email,
                @NotBlank String cpf,
                @NotNull @JsonFormat(pattern = "yyyy-MM-dd") LocalDate birthDate,
                @NotBlank String street,
                @NotBlank String number,
                @NotBlank String city,
                @NotBlank String state,
                @NotBlank String zipCode,
                @NotBlank String paymentMethod) {
}
