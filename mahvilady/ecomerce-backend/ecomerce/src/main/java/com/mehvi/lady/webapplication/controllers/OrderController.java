package com.mehvi.lady.webapplication.controllers;

import com.mehvi.lady.webapplication.controllers.requests.CheckoutRequest;
import com.mehvi.lady.webapplication.entities.Order;
import com.mehvi.lady.webapplication.entities.enums.OrderStatus;
import com.mehvi.lady.webapplication.services.CommonService;
import com.mehvi.lady.webapplication.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    private final CommonService commonService;


    @Autowired
    public OrderController(OrderService orderService, CommonService commonService) {
        this.orderService = orderService;
        this.commonService = commonService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Order> createOrder(@PathVariable Long userId, @RequestBody CheckoutRequest request) {
        Order order = commonService.safeOrder(request, userId);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/order-ids")
    public ResponseEntity<List<Long>> getIds() {
        return new ResponseEntity<>(orderService.getOrderIds(), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderService.getAllOrders(pageable);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/update-status/{orderId}/{status}")
    public ResponseEntity<Order> getOrderStatus(@PathVariable OrderStatus status, @PathVariable long orderId) {
        Order orders = orderService.getOrderById(orderId).orElse(null);
        if (Objects.nonNull(orders)) {
            orders.setStatus(status);
            orderService.saveOrder(orders);
            return new ResponseEntity<>(orders, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Order>> getAllOrders(@PathVariable Long userId, Pageable pageable) {
        Page<Order> orders = orderService.getOrderByUserId(userId, pageable);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getOrderCount() {
        long count = orderService.getOrderCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderById(@PathVariable Long id) {
        if (orderService.orderExists(id)) {
            orderService.deleteOrderById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<Page<Order>> getOrdersByStatus(@PathVariable OrderStatus status, Pageable pageable) {
        return new ResponseEntity<>(orderService.getOrdersByStatus(status, pageable), HttpStatus.OK);
    }
}
