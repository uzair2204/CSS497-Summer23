package com.mehvi.lady.webapplication.controllers;

import com.mehvi.lady.webapplication.controllers.requests.CheckoutRequest;
import com.mehvi.lady.webapplication.entities.OrderItem;
import com.mehvi.lady.webapplication.services.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/order-items")
@CrossOrigin
public class OrderItemController {

    private final OrderItemService orderitemService;

    @Autowired
    public OrderItemController(OrderItemService orderitemService) {
        this.orderitemService = orderitemService;
    }

    @PostMapping
    public ResponseEntity<OrderItem> createOrderItem(@RequestBody OrderItem orderitem) {
        OrderItem savedOrderItem = orderitemService.saveOrderItem(orderitem);
        return new ResponseEntity<>(savedOrderItem, HttpStatus.CREATED);
    }

    @PostMapping("/list")
    public ResponseEntity<List<OrderItem>> createAllOrderItem(@RequestBody List<OrderItem> orderItem) {
        List<OrderItem> savedOrderItem = orderitemService.saveAllOrderItems(orderItem);
        return new ResponseEntity<>(savedOrderItem, HttpStatus.CREATED);
    }

    @GetMapping("/reviewed/{productId}/{userId}")
    public ResponseEntity<Boolean> unReviewedOrderItem(@PathVariable Long productId, @PathVariable Long userId) {
        return new ResponseEntity<>(orderitemService.existsByOrderAndProductAndReviewed(userId, productId, Boolean.FALSE), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<OrderItem>> getAllOrderItems() {
        List<OrderItem> orderItems = orderitemService.getAllOrderItems();
        return new ResponseEntity<>(orderItems, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getOrderItemCount() {
        long count = orderitemService.getOrderItemCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItemById(@PathVariable Long id) {
        if (orderitemService.orderItemExists(id)) {
            orderitemService.deleteOrderItemById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
