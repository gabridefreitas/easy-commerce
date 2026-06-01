package com.easycommerce.server.order;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.easycommerce.server.auth.SessionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final SessionService sessionService;

    public OrderController(OrderService orderService, SessionService sessionService) {
        this.orderService = orderService;
        this.sessionService = sessionService;
    }

    @PostMapping
    public OrderSummaryResponse checkout(
            HttpServletRequest servletRequest,
            HttpServletResponse servletResponse,
            @Valid @RequestBody CheckoutRequest request) {
        String clientId = sessionService.getOrCreateSessionId(servletRequest, servletResponse);
        OrderSummaryResponse response = orderService.createOrder(request, clientId);
        sessionService.rotateSession(servletRequest, servletResponse);
        return response;
    }

    @GetMapping("/{orderId}")
    public OrderSummaryResponse getOrder(@PathVariable Long orderId) {
        return orderService.getOrderSummary(orderId);
    }
}
