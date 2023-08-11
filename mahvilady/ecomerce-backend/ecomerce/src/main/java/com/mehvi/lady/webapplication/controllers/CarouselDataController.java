package com.mehvi.lady.webapplication.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mehvi.lady.webapplication.entities.CarouselData;
import com.mehvi.lady.webapplication.services.CarouselDataService;
import com.mehvi.lady.webapplication.services.FileStorageService;
import com.mehvi.lady.webapplication.services.ObjectMapperService;
import com.mehvi.lady.webapplication.services.impl.ServicesServiceImpl;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/carousel-data")
@CrossOrigin
public class CarouselDataController {

    private final CarouselDataService carouselDataService;
    Logger logger = LogManager.getLogger(this.getClass());
    private final ObjectMapperService mapper;
    private final FileStorageService fileStorageService;

    @Value("${file.carousel.directory}")
    private String storageDirectory;

    @Autowired
    public CarouselDataController(CarouselDataService carouselDataService, ObjectMapperService mapper, FileStorageService fileStorageService) {
        this.carouselDataService = carouselDataService;
        this.mapper = mapper;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<CarouselData> createCarouselData(@RequestBody CarouselData carouselData) {
        CarouselData savedCarouselData = carouselDataService.saveCarouselData(carouselData);
        return new ResponseEntity<>(savedCarouselData, HttpStatus.CREATED);
    }

    @PostMapping("/list")
    public ResponseEntity<List<CarouselData>> createAllCarouselData(@RequestBody List<CarouselData> carouselData) {
        List<CarouselData> savedCarouselData = carouselDataService.saveAllCarouselData(carouselData);
        return new ResponseEntity<>(savedCarouselData, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarouselData> getCarouselDataById(@PathVariable Long id) {
        Optional<CarouselData> carouselData = carouselDataService.getCarouselDataById(id);
        return carouselData.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<CarouselData>> getAllCarouselData() {
        List<CarouselData> carouselData = carouselDataService.getAllCarouselData();
        return new ResponseEntity<>(carouselData, HttpStatus.OK);
    }
    @GetMapping(path = "/v2")
    public ResponseEntity<Page<CarouselData>> getAllServices(Pageable pageable) {
        Page<CarouselData> carouselData = carouselDataService.getAllCarouselData(pageable);
        return new ResponseEntity<>(carouselData, HttpStatus.OK);
    }


    @GetMapping("/count")
    public ResponseEntity<Long> getCarouselDataCount() {
        long count = carouselDataService.getCarouselDataCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarouselDataById(@PathVariable Long id) {
        if (carouselDataService.carouselDataExists(id)) {
            carouselDataService.deleteCarouselDataById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/v2")
    public ResponseEntity<CarouselData> uploadFile(@RequestPart("file") MultipartFile file,
                                                   @RequestParam("service") String serviceString) throws IOException, InterruptedException {
        CarouselData carouselData = mapper.fromJson(serviceString, CarouselData.class);
        CarouselData savedCarouselData = carouselDataService.saveCarouselData(carouselData);
        logger.info("{},{}", carouselData, savedCarouselData);
        String storedFileName = fileStorageService.storeFile(file, String.valueOf(savedCarouselData.getId()), storageDirectory);
        savedCarouselData.setImgUrl(storedFileName);
        carouselDataService.saveCarouselData(savedCarouselData);
        return new ResponseEntity<>(savedCarouselData, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarouselData> putCarouselDataById(@PathVariable Long id, @RequestBody CarouselData service) {
        logger.info("Request for id {}", id);
        CarouselData savedCarouselData = carouselDataService.getCarouselDataById(id).orElse(null);
        if (Objects.nonNull(savedCarouselData)) {
            savedCarouselData.copyValues(service);
            savedCarouselData = carouselDataService.saveCarouselData(savedCarouselData);
            return new ResponseEntity<>(savedCarouselData, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/v2")
    public ResponseEntity<CarouselData> putCarouselDataByIdWithFile(@PathVariable Long id, @RequestPart("file") MultipartFile file,
                                                                    @RequestParam("service") String serviceString) throws JsonProcessingException {
        logger.info("Request for id {}", id);
        CarouselData savedCarouselData = carouselDataService.getCarouselDataById(id).orElse(null);
        if (Objects.nonNull(savedCarouselData)) {
            CarouselData values = mapper.fromJson(serviceString, CarouselData.class);

            String storedFileName = fileStorageService.storeFile(file, String.valueOf(savedCarouselData.getId()),
                    savedCarouselData.getImgUrl(), storageDirectory);
            savedCarouselData.copyValues(values);
            savedCarouselData.setImgUrl(storedFileName);
            carouselDataService.saveCarouselData(savedCarouselData);
            return new ResponseEntity<>(savedCarouselData, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<Void> carouselDataToggleActiveById(@PathVariable Long id) {
        CarouselData carouselData = carouselDataService.getCarouselDataById(id).orElse(null);
        if (Objects.nonNull(carouselData)) {
            logger.info("Service before update{}", carouselData);
            carouselData.setActive(!carouselData.isActive());
            carouselDataService.saveCarouselData(carouselData);
            logger.info("Service after update{}", carouselData);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
