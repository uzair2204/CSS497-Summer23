package com.mehvi.lady.webapplication.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mehvi.lady.webapplication.entities.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
@Entity
@Table(name="orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany()
    private List<OrderItem> items = new ArrayList<>();
    @CreationTimestamp
    private LocalDateTime createdAt;
    private double discount;
    private double shippingCharges;
    private double totalPrice;
    private double grossTotal;
    private LocalDateTime deliveredAt;
    private LocalDate estimateDeliveryAt;
    @Enumerated(EnumType.STRING)
    private OrderStatus status; // Use the OrderStatus enum for status
    @ManyToOne
    private Address shippingAddress;
    @ManyToOne
    private Address billingAddress;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // getters and setters

    public void addOrderItem(OrderItem item){
        discount += item.getProductPrice()-item.getDiscountedPrice();
        grossTotal += item.getProductPrice();
        totalPrice += item.getDiscountedPrice();
        items.add(item);
        item.setOrder(this);
    }
}



