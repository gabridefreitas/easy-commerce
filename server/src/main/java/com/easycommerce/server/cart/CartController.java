package com.easycommerce.server.cart;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.easycommerce.server.auth.SessionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final SessionService sessionService;

    public CartController(CartService cartService, SessionService sessionService) {
        this.cartService = cartService;
        this.sessionService = sessionService;
    }

    @GetMapping
    public CartResponse getCart(HttpServletRequest request, HttpServletResponse response) {
        String clientId = sessionService.getOrCreateSessionId(request, response);
        return cartService.getCart(clientId);
    }

    @PostMapping("/items")
    public CartResponse addItem(
            HttpServletRequest servletRequest,
            HttpServletResponse servletResponse,
            @Valid @RequestBody AddCartItemRequest request) {
        String clientId = sessionService.getOrCreateSessionId(servletRequest, servletResponse);
        return cartService.addItem(clientId, request.productId());
    }

    @PutMapping("/items/{productId}")
    public CartResponse updateItemQuantity(
            HttpServletRequest servletRequest,
            HttpServletResponse servletResponse,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartItemRequest body) {
        String clientId = sessionService.getOrCreateSessionId(servletRequest, servletResponse);
        return cartService.updateItemQuantity(clientId, productId, body.quantity());
    }

    @DeleteMapping("/items/{productId}")
    public CartResponse removeItem(
            HttpServletRequest request,
            HttpServletResponse response,
            @PathVariable Long productId) {
        String clientId = sessionService.getOrCreateSessionId(request, response);
        return cartService.removeItem(clientId, productId);
    }

    @PostMapping("/coupon/{code}")
    public CartResponse applyCoupon(
            HttpServletRequest request,
            HttpServletResponse response,
            @PathVariable String code) {
        String clientId = sessionService.getOrCreateSessionId(request, response);
        return cartService.applyCoupon(clientId, code);
    }

    @DeleteMapping("/coupon")
    public CartResponse clearCoupon(HttpServletRequest request, HttpServletResponse response) {
        String clientId = sessionService.getOrCreateSessionId(request, response);
        return cartService.clearCoupon(clientId);
    }
}
