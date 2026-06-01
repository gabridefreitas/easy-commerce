package com.easycommerce.server.cart;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class CartCalculator {

    private CartCalculator() {
    }

    public static BigDecimal applyCoupon(BigDecimal total, int discountPercent) {
        BigDecimal discount = total.multiply(BigDecimal.valueOf(discountPercent)).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        return total.subtract(discount).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
    }
}
