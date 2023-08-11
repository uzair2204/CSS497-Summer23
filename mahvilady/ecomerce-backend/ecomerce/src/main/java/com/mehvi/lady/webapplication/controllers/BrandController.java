package com.mehvi.lady.webapplication.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mehvi.lady.webapplication.entities.Brand;
import com.mehvi.lady.webapplication.services.BrandService;
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
@RequestMapping("/brands")
@CrossOrigin
public class BrandController {

    private final BrandService brandService;
    Logger logger = LogManager.getLogger(this.getClass());
    private final ServicesServiceImpl servicesService;
    private final ObjectMapperService mapper;
    private final FileStorageService fileStorageService;

    @Value("${file.service.directory}")
    private String storageDirectory;

    @Autowired
    public BrandController(BrandService brandService, ServicesServiceImpl servicesService, ObjectMapperService mapper, FileStorageService fileStorageService) {
        this.brandService = brandService;
        this.servicesService = servicesService;
        this.mapper = mapper;
        this.fileStorageService = fileStorageService;
    }
    @PostMapping
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brands) {
        Brand savedBrand = brandService.saveBrand(brands);
        return new ResponseEntity<>(savedBrand, HttpStatus.CREATED);
    }

    @PostMapping("/list")
    public ResponseEntity<List<Brand>> createAllBrand(@RequestBody List<Brand> brands) {
        List<Brand> savedBrand = brandService.saveAllBrands(brands);
        return new ResponseEntity<>(savedBrand, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        Optional<Brand> brands = brandService.getBrandById(id);
        return brands.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Brand>> getAllBrand() {
        List<Brand> brands = brandService.getAllBrands();
        return new ResponseEntity<>(brands, HttpStatus.OK);
    }

    @GetMapping(path ="/names")
    public ResponseEntity<List<String>> getAllBrandName() {
        List<String> brands = brandService.getAllBrandsNames();
        return new ResponseEntity<>(brands, HttpStatus.OK);
    }

    @GetMapping(path = "/v2")
    public ResponseEntity<Page<Brand>> getAllBrand(Pageable pageable) {
        Page<Brand> brands = brandService.getAllBrands(pageable);
        return new ResponseEntity<>(brands, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getBrandCount() {
        long count = brandService.getBrandCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrandById(@PathVariable Long id) {
        if (brandService.brandExists(id)) {
            brandService.deleteBrandById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/v2")
    public ResponseEntity<Brand> uploadFile(@RequestPart("file") MultipartFile file,
                                            @RequestParam("brand") String brandString) throws IOException, InterruptedException {
        Brand brands = mapper.fromJson(brandString, Brand.class);
        logger.info("{},{}", brands, brandString);
        Brand savedBrand = brandService.saveBrand(brands);
        logger.info("{},{}", brands, savedBrand);
        String storedFileName = fileStorageService.storeFile(file, String.valueOf(savedBrand.getId()), storageDirectory);
        savedBrand.setImage(storedFileName);
        brandService.saveBrand(savedBrand);
        return new ResponseEntity<>(savedBrand, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Brand> putBrandById(@PathVariable Long id, @RequestBody Brand brand) {
        logger.info("Request for id {}", id);
        Brand savedBrand = brandService.getBrandById(id).orElse(null);
        if (Objects.nonNull(savedBrand)) {
            savedBrand.copyValues(brand);
            savedBrand = brandService.saveBrand(savedBrand);
            return new ResponseEntity<>(savedBrand, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/v2")
    public ResponseEntity<Brand> putBrandByIdWithFile(@PathVariable Long id, @RequestPart("file") MultipartFile file,
                                                      @RequestParam("brand") String brandString) throws JsonProcessingException {
        logger.info("Request for id {}", id);
        Brand savedBrand = brandService.getBrandById(id).orElse(null);
        if (Objects.nonNull(savedBrand)) {
            Brand values = mapper.fromJson(brandString, Brand.class);

            String storedFileName = fileStorageService.storeFile(file, String.valueOf(savedBrand.getId()),
                    savedBrand.getImage(), storageDirectory);
            savedBrand.copyValues(values);
            savedBrand.setImage(storedFileName);
            brandService.saveBrand(savedBrand);
            return new ResponseEntity<>(savedBrand, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<Void> brandsToggleActiveById(@PathVariable Long id) {
        Brand brands = brandService.getBrandById(id).orElse(null);
        if (Objects.nonNull(brands)) {
            logger.info("Service before update{}", brands);
            brands.setActive(!brands.isActive());
            brandService.saveBrand(brands);
            logger.info("Service after update{}", brands);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
