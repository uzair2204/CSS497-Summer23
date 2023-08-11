package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.Product;
import com.mehvi.lady.webapplication.entities.WishProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WishProductRepository extends JpaRepository<WishProduct, Long> {
    @Query("SELECT p FROM WishProduct wp JOIN Product p ON wp.productId = p.id WHERE wp.userId = :userId")
    Page<Product> findWishProductsByUserIdWithProducts(Pageable pageable, @Param("userId") Long userId);

    boolean existsByUserIdAndProductId(long userId,long productId);
    Optional<WishProduct> getByUserIdAndProductId(long userId, long productId);
    List<WishProduct> findByUserId(long userId);


}
