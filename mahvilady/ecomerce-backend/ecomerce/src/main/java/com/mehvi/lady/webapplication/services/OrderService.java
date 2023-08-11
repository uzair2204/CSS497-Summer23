package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Order;
import com.mehvi.lady.webapplication.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.mehvi.lady.webapplication.entities.enums.OrderStatus;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Save a single order
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    // Save a collection of orders
    public List<Order> saveAllOrders(List<Order> orders) {
        return orderRepository.saveAll(orders);
    }

    // Get an order by its ID
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // Check if an order with the given ID exists in the database
    public boolean orderExists(Long id) {
        return orderRepository.existsById(id);
    }

    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get orders by a list of IDs
    public List<Order> getOrdersByIds(List<Long> ids) {
        return orderRepository.findAllById(ids);
    }

    // Get the total number of orders in the database
    public long getOrderCount() {
        return orderRepository.count();
    }

    // Delete an order by its ID
    public void deleteOrderById(Long id) {
        orderRepository.deleteById(id);
    }

    // Delete a single order
    public void deleteOrder(Order order) {
        orderRepository.delete(order);
    }

    public Page<Order> getOrderByUserId(long userId, Pageable pageable){
        return  orderRepository.findByUser_Id(userId,pageable);
    }

    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }
    public List<Long> getOrderIds() {
        return orderRepository.getAllIds();
    }

    public Page<Order> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable);
    }
}
