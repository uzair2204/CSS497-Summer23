package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
}
