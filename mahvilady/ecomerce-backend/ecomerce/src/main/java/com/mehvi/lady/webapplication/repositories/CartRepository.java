package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser_Id(Long userId);
    Optional<Cart> findByProduct_IdAndUser_Id(Long productId, Long userId);
    void deleteByUser_Id(Long userId);
    void deleteByProduct_IdAndUser_Id(Long productId, Long userId);

}
