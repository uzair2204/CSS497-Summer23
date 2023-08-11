package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Product;
import com.mehvi.lady.webapplication.entities.WishProduct;
import com.mehvi.lady.webapplication.repositories.WishProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class WishProductService {
    // Save a single wishProduct
    private final WishProductRepository wishProductRepository;

    @Autowired
    public WishProductService(WishProductRepository wishProductRepository) {
        this.wishProductRepository = wishProductRepository;
    }

    // Save a single wishProduct
    public WishProduct saveWishProduct(WishProduct wishProduct) {
        return wishProductRepository.save(wishProduct);
    }

    // Save a collection of wishProducts
    public List<WishProduct> saveAllWishProducts(List<WishProduct> wishProducts) {
        return wishProductRepository.saveAll(wishProducts);
    }

    // Get wishProduct by its ID
    public Optional<WishProduct> getWishProductById(Long id) {
        return wishProductRepository.findById(id);
    }

    // Check if wishProduct with the given ID exists in the database
    public boolean wishProductExists(Long id) {
        return wishProductRepository.existsById(id);
    }

    // Get all wishProducts
    public List<WishProduct> getAllWishProducts() {
        return wishProductRepository.findAll();
    }

    public Page<WishProduct> getAllWishProducts(Pageable pageable) {
        return wishProductRepository.findAll(pageable);
    }

    public Page<Product> getAllWishProductsByUserID(Pageable pageable, long userId) {
        return wishProductRepository.findWishProductsByUserIdWithProducts(pageable,userId);
    }

    // Get wishProducts by a list of IDs
    public List<WishProduct> getWishProductsByIds(List<Long> ids) {
        return wishProductRepository.findAllById(ids);
    }

    // Get the total number of wishProducts in the database
    public long getWishProductCount() {
        return wishProductRepository.count();
    }

    // Delete an wishProduct by its ID
    public void deleteWishProductById(Long id) {
        wishProductRepository.deleteById(id);
    }

    // Delete a single wishProduct
    public void deleteWishProduct(WishProduct wishProduct) {
        wishProductRepository.delete(wishProduct);
    }

    public boolean isProductInWishlist(long userId, long productId) {
        return wishProductRepository.existsByUserIdAndProductId(userId, productId);
    }

    public Optional<WishProduct> getProductFromWishlist(long userId, long productId) {
        return wishProductRepository.getByUserIdAndProductId(userId, productId);
    }

    public List<WishProduct> getProductFromWishlistByUserId(long userId) {
        return wishProductRepository.findByUserId(userId);
    }
}
