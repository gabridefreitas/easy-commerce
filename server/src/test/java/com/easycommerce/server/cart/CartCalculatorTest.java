package com.easycommerce.server.cart;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class CartCalculatorTest {

    @Test
    void shouldApplyCouponDiscount() {
        BigDecimal discounted = CartCalculator.applyCoupon(new BigDecimal("200.00"), 10);
        assertEquals(new BigDecimal("180.00"), discounted);
    }

    @Test
    void shouldNotReturnNegativeValue() {
        BigDecimal discounted = CartCalculator.applyCoupon(new BigDecimal("10.00"), 100);
        assertEquals(new BigDecimal("0.00"), discounted);
    }
}
