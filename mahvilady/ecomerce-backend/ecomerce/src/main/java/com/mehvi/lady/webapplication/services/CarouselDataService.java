package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.CarouselData;
import com.mehvi.lady.webapplication.repositories.CarouselDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class CarouselDataService {

    private final CarouselDataRepository carouselDataRepository;

    @Autowired
    public CarouselDataService(CarouselDataRepository carouseldataRepository) {
        this.carouselDataRepository = carouseldataRepository;
    }

    // Save a single carouselData
    public CarouselData saveCarouselData(CarouselData carouselData) {
        return carouselDataRepository.save(carouselData);
    }

    // Save a collection of carouselData

    public List<CarouselData> saveAllCarouselData(List<CarouselData> carouselData
    ) {
        return carouselDataRepository.saveAll(carouselData
        );
    }

    // Get an carouselData by its ID
    public Optional<CarouselData> getCarouselDataById(Long id) {
        return carouselDataRepository.findById(id);
    }

    // Check if an carouselData with the given ID exists in the database
    public boolean carouselDataExists(Long id) {
        return carouselDataRepository.existsById(id);
    }

    // Get all carouselData

    public List<CarouselData> getAllCarouselData() {
        return carouselDataRepository.findAll();
    }

    public Page<CarouselData> getAllCarouselData(Pageable page) {
        return carouselDataRepository.findAll(page);
    }

    // Get carouselData
    // by a list of IDs
    public List<CarouselData> getCarouselDataByIds(List<Long> ids) {
        return carouselDataRepository.findAllById(ids);
    }

    // Get the total number of carouselData
    // in the database
    public long getCarouselDataCount() {
        return carouselDataRepository.count();
    }

    // Delete an carouselData by its ID
    public void deleteCarouselDataById(Long id) {
        carouselDataRepository.deleteById(id);
    }

    // Delete a single carouselData
    public void deleteCarouselData(CarouselData carouselData) {
        carouselDataRepository.delete(carouselData);
    }
}
