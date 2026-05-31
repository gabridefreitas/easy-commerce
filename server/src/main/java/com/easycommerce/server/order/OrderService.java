package com.easycommerce.server.order;

import com.easycommerce.server.cart.Cart;
import com.easycommerce.server.cart.CartItem;
import com.easycommerce.server.cart.CartService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;

    public OrderService(OrderRepository orderRepository, CartService cartService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
    }

    @Transactional
    public OrderSummaryResponse createOrder(CheckoutRequest request, String clientId) {
        Cart cart = cartService.getRequiredCart(clientId);

        if (cart.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }

        OrderEntity order = new OrderEntity();
        order.setClientId(clientId);
        order.setName(request.name());
        order.setEmail(request.email());
        order.setCpf(request.cpf());
        order.setBirthDate(request.birthDate());
        order.setStreet(request.street());
        order.setNumber(request.number());
        order.setCity(request.city());
        order.setState(request.state());
        order.setZipCode(request.zipCode());
        order.setPaymentMethod(request.paymentMethod());

        BigDecimal cartTotal = cart.getItems().stream()
                .map(this::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer discountPercent = cart.getCoupon() != null ? cart.getCoupon().getDiscountPercent() : 0;
        BigDecimal finalTotal = cartTotal.multiply(BigDecimal.valueOf(100 - discountPercent))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        order.setTotal(finalTotal);

        cart.getItems().forEach(cartItem -> order.getItems().add(new OrderItem(
                order,
                cartItem.getProduct().getId(),
                cartItem.getProduct().getTitle(),
                cartItem.getProduct().getPrice(),
                cartItem.getQuantity()
        )));

        OrderEntity savedOrder = orderRepository.save(order);
        cartService.clearCart(clientId);
        return toSummary(savedOrder);
    }

    @Transactional(readOnly = true)
    public OrderSummaryResponse getOrderSummary(Long orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        return toSummary(order);
    }

    private BigDecimal lineTotal(CartItem item) {
        return item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
    }

    private OrderSummaryResponse toSummary(OrderEntity order) {
        List<OrderSummaryItemResponse> items = order.getItems().stream()
                .map(item -> new OrderSummaryItemResponse(
                        item.getProductId(),
                        item.getTitle(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                ))
                .toList();

        return new OrderSummaryResponse(
                order.getId(),
                order.getName(),
                order.getEmail(),
                order.getCpf(),
                order.getBirthDate(),
                order.getStreet(),
                order.getNumber(),
                order.getCity(),
                order.getState(),
                order.getZipCode(),
                order.getPaymentMethod(),
                order.getTotal(),
                items
        );
    }
}
