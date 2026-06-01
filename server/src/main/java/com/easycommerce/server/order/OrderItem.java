package com.easycommerce.server.order;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String title;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    public OrderItem() {
    }

    public OrderItem(OrderEntity order, Long productId, String title, BigDecimal unitPrice, Integer quantity) {
        this.order = order;
        this.productId = productId;
        this.title = title;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public String getTitle() {
        return title;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }
}
