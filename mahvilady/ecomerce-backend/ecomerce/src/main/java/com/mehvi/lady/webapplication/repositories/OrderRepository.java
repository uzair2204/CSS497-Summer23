package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.Order;
import com.mehvi.lady.webapplication.entities.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUser_Id(Long userId, Pageable pageable);
    @Query("SELECT o.id FROM Order o")
    List<Long> getAllIds();

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
}
