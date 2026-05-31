package com.easycommerce.server.cart;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        List<CartItemResponse> items,
        CartCouponResponse coupon,
        BigDecimal cartTotal,
        BigDecimal finalTotal
) {
}
