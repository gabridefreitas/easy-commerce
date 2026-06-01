package com.easycommerce.server.order;

import java.math.BigDecimal;

public record OrderSummaryItemResponse(
                Long productId,
                String title,
                BigDecimal unitPrice,
                Integer quantity,
                BigDecimal subtotal) {
}
