package com.mehvi.lady.webapplication.repositories;


import com.mehvi.lady.webapplication.entities.Size;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SizeRepository extends JpaRepository<Size, Long> {

    boolean existsByName(String name);
}
