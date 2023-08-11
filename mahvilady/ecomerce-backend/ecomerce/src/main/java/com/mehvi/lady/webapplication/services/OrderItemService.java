package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Order;
import com.mehvi.lady.webapplication.entities.OrderItem;
import com.mehvi.lady.webapplication.entities.Product;
import com.mehvi.lady.webapplication.entities.User;
import com.mehvi.lady.webapplication.repositories.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    @Autowired
    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    // Save a single orderItem
    public OrderItem saveOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    // Save a collection of orderItems
    public List<OrderItem> saveAllOrderItems(List<OrderItem> orderItems) {
        return orderItemRepository.saveAll(orderItems);
    }

    // Get an orderItem by its ID
    public Optional<OrderItem> getOrderItemById(Long id) {
        return orderItemRepository.findById(id);
    }

    // Check if an orderItem with the given ID exists in the database
    public boolean orderItemExists(Long id) {
        return orderItemRepository.existsById(id);
    }

    // Get all orderItems
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    // Get orderItems by a list of IDs
    public List<OrderItem> getOrderItemsByIds(List<Long> ids) {
        return orderItemRepository.findAllById(ids);
    }

    // Get the total number of orderItems in the database
    public long getOrderItemCount() {
        return orderItemRepository.count();
    }

    // Delete an orderItem by its ID
    public void deleteOrderItemById(Long id) {
        orderItemRepository.deleteById(id);
    }

    // Delete a single orderItem
    public void deleteOrderItem(OrderItem orderItem) {
        orderItemRepository.delete(orderItem);
    }

    public boolean existsByOrderAndProductAndReviewed(long userId, long productId, Boolean reviewed) {
        return orderItemRepository.existsUnreviewedForUserAndProduct(userId, productId, reviewed);
    }

    public List<OrderItem> getUnreviewedForUserAndProduct(Long user, Long product, Boolean oldStatus) {
       return  orderItemRepository.getUnreviewedForUserAndProduct(user, product, oldStatus);
    }

}
