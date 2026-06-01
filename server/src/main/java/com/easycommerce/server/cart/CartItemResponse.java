package com.easycommerce.server.cart;

import java.math.BigDecimal;

public record CartItemResponse(
                Long id,
                String title,
                BigDecimal price,
                String image,
                String description,
                Integer quantity,
                BigDecimal subtotal) {
}
