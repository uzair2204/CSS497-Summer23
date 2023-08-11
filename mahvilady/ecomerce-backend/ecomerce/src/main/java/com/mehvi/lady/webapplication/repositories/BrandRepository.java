package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    @Query("SELECT b.name FROM Brand b")
    List<String> getAllNames();
}
