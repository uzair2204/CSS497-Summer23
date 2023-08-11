package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.controllers.requests.CartRequest;
import com.mehvi.lady.webapplication.entities.Cart;
import com.mehvi.lady.webapplication.repositories.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class CartService {
    private final CartRepository cartRepository;


    @Autowired
    public CartService(CartRepository orderRepository) {
        this.cartRepository = orderRepository;
    }

    // Save a single order
    public Cart saveCart(Cart order) {
        return cartRepository.save(order);
    }

    // Save a collection of orders
    public List<Cart> saveAllCarts(List<Cart> orders) {
        return cartRepository.saveAll(orders);
    }

    // Get an order by its ID
    public Optional<Cart> getCartById(Long id) {
        return cartRepository.findById(id);
    }

    // Check if an order with the given ID exists in the database
    public boolean cartExists(Long id) {
        return cartRepository.existsById(id);
    }

    // Get all orders
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    // Get orders by a list of IDs
    public List<Cart> getCartsByIds(List<Long> ids) {
        return cartRepository.findAllById(ids);
    }

    // Get the total number of orders in the database
    public long getCartCount() {
        return cartRepository.count();
    }

    // Delete an order by its ID
    public void deleteCartById(Long id) {
        cartRepository.deleteById(id);
    }

    // Delete a single order
    public void deleteCart(Cart order) {
        cartRepository.delete(order);
    }

    public List<Cart> getCartsByUserId(Long userId) {
        return cartRepository.findByUser_Id(userId);
    }

    public Optional<Cart> getCartsByProductIdAndUserId(Long productId, Long userId) {
        return cartRepository.findByProduct_IdAndUser_Id(productId, userId);
    }
    public void deleteCartsByUserId(Long userId) {
        cartRepository.deleteByUser_Id(userId);
    }

    public void deleteCartsByProductIdAndUserId(Long productId, Long userId) {
        cartRepository.deleteByProduct_IdAndUser_Id(productId, userId);
    }
}
