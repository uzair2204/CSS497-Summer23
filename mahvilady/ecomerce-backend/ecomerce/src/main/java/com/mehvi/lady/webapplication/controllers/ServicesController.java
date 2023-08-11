package com.mehvi.lady.webapplication.controllers;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.mehvi.lady.webapplication.entities.Services;
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

@CrossOrigin
@RestController
@RequestMapping("/services")
public class ServicesController {
    Logger logger = LogManager.getLogger(this.getClass());
    private final ServicesServiceImpl servicesService;
    private final ObjectMapperService mapper;
    private final FileStorageService fileStorageService;
    @Value("${file.service.directory}")
    private String storageDirectory;

    @Autowired
    public ServicesController(ServicesServiceImpl servicesService, ObjectMapperService mapper, FileStorageService fileStorageService) {
        this.servicesService = servicesService;
        this.mapper = mapper;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<Services> createServices(@RequestBody Services services) {
        Services savedServices = servicesService.saveServices(services);
        return new ResponseEntity<>(savedServices, HttpStatus.CREATED);
    }

    @PostMapping("/list")
    public ResponseEntity<List<Services>> createAllServices(@RequestBody List<Services> services) {
        List<Services> savedServices = servicesService.saveAllServices(services);
        return new ResponseEntity<>(savedServices, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Services> getServicesById(@PathVariable Long id) {

        Optional<Services> services = servicesService.getServicesById(id);
        return services.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Services>> getAllServices() {
        List<Services> services = servicesService.getAllServices();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }

    @GetMapping(path = "/v2")
    public ResponseEntity<Page<Services>> getAllServices(Pageable pageable) {
        Page<Services> services = servicesService.getAllServices(pageable);
        return new ResponseEntity<>(services, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getServicesCount() {
        long count = servicesService.getServicesCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteServicesById(@PathVariable Long id) {
        if (servicesService.servicesExists(id)) {
            servicesService.deleteServicesById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/v2")
    public ResponseEntity<Services> uploadFile(@RequestPart("file") MultipartFile file,
                                               @RequestParam("service") String serviceString) throws IOException, InterruptedException {
        Services services = mapper.fromJson(serviceString, Services.class);
        logger.info("{},{}", services, serviceString);
        Services savedServices = servicesService.saveServices(services);
        logger.info("{},{}", services, savedServices);
        String storedFileName = fileStorageService.storeFile(file, String.valueOf(savedServices.getId()), storageDirectory);
        savedServices.setIcon(storedFileName);
        servicesService.saveServices(savedServices);
        return new ResponseEntity<>(savedServices, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Services> putServicesById(@PathVariable Long id, @RequestBody Services service) {
        logger.info("Request for id {}", id);
        Services savedServices = servicesService.getServicesById(id).orElse(null);
        if (Objects.nonNull(savedServices)) {
            savedServices.copyValues(service);
            savedServices = servicesService.saveServices(savedServices);
            return new ResponseEntity<>(savedServices, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/v2")
    public ResponseEntity<Services> putServicesByIdWithFile(@PathVariable Long id, @RequestPart("file") MultipartFile file,
                                                            @RequestParam("service") String serviceString) throws JsonProcessingException {
        logger.info("Request for id {}", id);
        Services savedServices = servicesService.getServicesById(id).orElse(null);
        if (Objects.nonNull(savedServices)) {
            Services values = mapper.fromJson(serviceString, Services.class);

            String storedFileName = fileStorageService.storeFile(file, String.valueOf(savedServices.getId()),
                    savedServices.getIcon(), storageDirectory);
            savedServices.copyValues(values);
            savedServices.setIcon(storedFileName);
            servicesService.saveServices(savedServices);
            return new ResponseEntity<>(savedServices, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<Void> servicesToggleActiveById(@PathVariable Long id) {
        Services services = servicesService.getServicesById(id).orElse(null);
        if (Objects.nonNull(services)) {
            logger.info("Service before update{}", services);
            services.setActive(!services.isActive());
            servicesService.saveServices(services);
            logger.info("Service after update{}", services);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
