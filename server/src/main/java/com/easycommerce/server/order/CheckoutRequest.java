package com.easycommerce.server.order;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CheckoutRequest(
        @NotBlank String clientId,
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank String cpf,
        @NotNull @JsonFormat(pattern = "yyyy-MM-dd") LocalDate birthDate,
        @NotBlank String street,
        @NotBlank String number,
        @NotBlank String city,
        @NotBlank String state,
        @NotBlank String zipCode,
        @NotBlank String paymentMethod
) {
}
