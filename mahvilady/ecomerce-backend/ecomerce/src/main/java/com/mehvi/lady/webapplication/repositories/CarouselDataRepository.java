package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.CarouselData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarouselDataRepository extends JpaRepository<CarouselData, Long> {

}
