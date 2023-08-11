package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicesRepository extends JpaRepository<Services, Long> {
}
