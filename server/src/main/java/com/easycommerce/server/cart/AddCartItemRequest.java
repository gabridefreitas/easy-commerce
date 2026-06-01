package com.easycommerce.server.cart;

import jakarta.validation.constraints.NotNull;

public record AddCartItemRequest(
                @NotNull Long productId) {
}
