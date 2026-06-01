package com.easycommerce.server.cart;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.easycommerce.server.coupon.Coupon;
import com.easycommerce.server.coupon.CouponRepository;
import com.easycommerce.server.product.Product;
import com.easycommerce.server.product.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            CouponRepository couponRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.couponRepository = couponRepository;
    }

    @Transactional
    public CartResponse getCart(String clientId) {
        Cart cart = getOrCreateCart(clientId);
        return toResponse(cart);
    }

    @Transactional
    public CartResponse addItem(String clientId, Long productId) {
        Cart cart = getOrCreateCart(clientId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .ifPresentOrElse(
                        cartItem -> cartItem.setQuantity(cartItem.getQuantity() + 1),
                        () -> cart.addItem(new CartItem(cart, product, 1)));

        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItemQuantity(String clientId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(clientId);

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found in cart"));

        if (quantity == 0) {
            cart.removeItem(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
        }

        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItem(String clientId, Long productId) {
        return updateItemQuantity(clientId, productId, 0);
    }

    @Transactional
    public CartResponse applyCoupon(String clientId, String couponCode) {
        Cart cart = getOrCreateCart(clientId);
        Coupon coupon = couponRepository.findByCodeIgnoreCase(couponCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found"));

        cart.setCoupon(coupon);
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse clearCoupon(String clientId) {
        Cart cart = getOrCreateCart(clientId);
        cart.setCoupon(null);
        return toResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(String clientId) {
        Cart cart = getOrCreateCart(clientId);
        cart.clearItems();
        cart.setCoupon(null);
        cartRepository.save(cart);
    }

    @Transactional(readOnly = true)
    public Cart getRequiredCart(String clientId) {
        return cartRepository.findByClientId(clientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));
    }

    private Cart getOrCreateCart(String clientId) {
        return cartRepository.findByClientId(clientId)
                .orElseGet(() -> cartRepository.save(new Cart(clientId)));
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> {
                    BigDecimal subtotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                    return new CartItemResponse(
                            item.getProduct().getId(),
                            item.getProduct().getTitle(),
                            item.getProduct().getPrice(),
                            item.getProduct().getImage(),
                            item.getProduct().getDescription(),
                            item.getQuantity(),
                            subtotal);
                })
                .toList();

        BigDecimal cartTotal = items.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        Integer discount = cart.getCoupon() != null ? cart.getCoupon().getDiscountPercent() : 0;
        BigDecimal finalTotal = cartTotal.multiply(BigDecimal.valueOf(100 - discount))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        CartCouponResponse coupon = cart.getCoupon() == null
                ? null
                : new CartCouponResponse(cart.getCoupon().getCode(), cart.getCoupon().getDiscountPercent());

        return new CartResponse(items, coupon, cartTotal, finalTotal);
    }
}
