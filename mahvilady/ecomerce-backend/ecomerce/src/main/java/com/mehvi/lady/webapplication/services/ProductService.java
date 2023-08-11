package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Product;
import com.mehvi.lady.webapplication.entities.Shop;
import com.mehvi.lady.webapplication.repositories.ProductRepository;
import com.mehvi.lady.webapplication.repositories.beans.ProductSearchCriteria;
import com.mehvi.lady.webapplication.repositories.beans.ProductSpecification;
import com.mehvi.lady.webapplication.utils.CommonUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Save a single product
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Save a collection of products
    public List<Product> saveAllProducts(List<Product> products) {
        return productRepository.saveAll(products);
    }

    // Get a product by its ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Check if a product with the given ID exists in the database
    public boolean productExists(Long id) {
        return productRepository.existsById(id);
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get products by a list of IDs
    public List<Product> getProductsByIds(List<Long> ids) {
        return productRepository.findAllById(ids);
    }

    // Get the total number of products in the database
    public long getProductCount() {
        return productRepository.count();
    }

    // Delete a product by its ID
    public void deleteProductById(Long id) {
        productRepository.deleteById(id);
    }

    // Delete a single product
    public void deleteProduct(Product product) {
        productRepository.delete(product);
    }

    // Get all products by pagination
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public boolean slugExist(String name) {
        return productRepository.existsBySlugIgnoreCase(name);
    }

    public Optional<Product> getBySlug(String slug) {
        return productRepository.getBySlug(slug);
    }

    public List<String> getAllSlugs() {
        return productRepository.getAllSlugs();
    }

    public List<Shop> getShopsByCategoryIds(List<Long> ids) {
        return productRepository.findShopsByCategoryIds(ids);
    }

    public Page<Product> getProductsByCategoryIds(List<Long> ids, Pageable pageable) {
        return productRepository.findProductByCategoryIds(ids, pageable);
    }

    public Page<Shop> getTopShopsByCategoryIds(List<Long> ids, Pageable pageable) {
        return productRepository.findTopShopsByCategoryIds(ids, pageable);
    }

    public Page<Product> getProductsByNameContaining(String keyword, Pageable pageable) {
        return productRepository.findProductsByNameContaining(keyword.toLowerCase(), pageable);
    }

    public Page<Product> getProductsByCategorySlug(String keyword, Pageable pageable) {
        return productRepository.findProductsByCategorySlug(keyword, pageable);
    }

    public Page<Product> getProductsByBrandSlug(String keyword, Pageable pageable) {
        return productRepository.findProductsByBrandSlug(keyword, pageable);
    }

    public Page<Product> searchProducts(ProductSearchCriteria criteria, Pageable pageable) {
        Specification<Product> specification = ProductSpecification.withCriteria(criteria);
        logger.info(specification.toString());
        return productRepository.findAll(specification, pageable);
    }

    public List<String> getTitles(String title, String category) {
        if (CommonUtils.isNullOrEmptyString(category) || category.equalsIgnoreCase("All Categories")) {
            return productRepository.getTitlesSuggestion(title);
        }
        return productRepository.getTitlesSuggestionByCategory(category, title);
    }

}
