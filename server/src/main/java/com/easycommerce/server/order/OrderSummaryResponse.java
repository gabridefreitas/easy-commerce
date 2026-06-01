package com.easycommerce.server.order;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record OrderSummaryResponse(
        Long id,
        String name,
        String email,
        String cpf,
        LocalDate birthDate,
        String street,
        String number,
        String city,
        String state,
        String zipCode,
        String paymentMethod,
        BigDecimal total,
        List<OrderSummaryItemResponse> items
) {
}
