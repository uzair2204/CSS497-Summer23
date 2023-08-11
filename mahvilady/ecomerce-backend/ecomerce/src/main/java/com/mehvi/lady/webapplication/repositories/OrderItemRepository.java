package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.Order;
import com.mehvi.lady.webapplication.entities.OrderItem;
import com.mehvi.lady.webapplication.entities.Product;
import com.mehvi.lady.webapplication.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT CASE WHEN COUNT(oi) > 0 THEN true ELSE false END " +
            "FROM OrderItem oi " +
            "JOIN oi.order o " +
            "JOIN oi.product p " +
            "WHERE o.user.id = :userId AND p.id = :productId AND oi.reviewed = :reviewed")
    boolean existsUnreviewedForUserAndProduct(long userId, Long productId, Boolean reviewed);

    @Query("SELECT oi " +
            "FROM OrderItem oi " +
            "JOIN oi.order o " +
            "JOIN oi.product p " +
            "WHERE o.user.id = :userId AND p.id = :productId AND oi.reviewed = :reviewed")
    List<OrderItem> getUnreviewedForUserAndProduct(long userId, Long productId, Boolean reviewed);


}
