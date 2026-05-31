package com.easycommerce.server.cart;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{clientId}")
    public CartResponse getCart(@PathVariable String clientId) {
        return cartService.getCart(clientId);
    }

    @PostMapping("/{clientId}/items")
    public CartResponse addItem(@PathVariable String clientId, @Valid @RequestBody AddCartItemRequest request) {
        return cartService.addItem(clientId, request.productId());
    }

    @PutMapping("/{clientId}/items/{productId}")
    public CartResponse updateItemQuantity(
            @PathVariable String clientId,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return cartService.updateItemQuantity(clientId, productId, request.quantity());
    }

    @DeleteMapping("/{clientId}/items/{productId}")
    public CartResponse removeItem(@PathVariable String clientId, @PathVariable Long productId) {
        return cartService.removeItem(clientId, productId);
    }

    @PostMapping("/{clientId}/coupon/{code}")
    public CartResponse applyCoupon(@PathVariable String clientId, @PathVariable String code) {
        return cartService.applyCoupon(clientId, code);
    }

    @DeleteMapping("/{clientId}/coupon")
    public CartResponse clearCoupon(@PathVariable String clientId) {
        return cartService.clearCoupon(clientId);
    }
}
