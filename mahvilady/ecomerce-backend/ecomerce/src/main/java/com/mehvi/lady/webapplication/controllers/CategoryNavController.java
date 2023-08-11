package com.mehvi.lady.webapplication.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mehvi.lady.webapplication.controllers.requests.CategoryNavRequest;
import com.mehvi.lady.webapplication.entities.CategoryNav;
import com.mehvi.lady.webapplication.entities.Services;
import com.mehvi.lady.webapplication.services.CategoryNavService;
import com.mehvi.lady.webapplication.services.FileStorageService;
import com.mehvi.lady.webapplication.services.ObjectMapperService;
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
@RequestMapping("/category-navs")
@CrossOrigin
public class CategoryNavController {

    Logger logger = LogManager.getLogger(this.getClass());
    private final CategoryNavService categoryNavService;
    private final ObjectMapperService mapper;
    private final FileStorageService fileStorageService;
    @Value("${file.nav.directory}")
    private String storageDirectory;

    @Autowired
    public CategoryNavController(CategoryNavService categoryNavService, ObjectMapperService mapper, FileStorageService fileStorageService) {
        this.categoryNavService = categoryNavService;
        this.mapper = mapper;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<CategoryNav> createCategoryNav(@RequestBody CategoryNav categoryNav) {
        CategoryNav savedCategoryNav = categoryNavService.saveCategoryNav(categoryNav);
        return new ResponseEntity<>(savedCategoryNav, HttpStatus.CREATED);
    }

    @PostMapping("/list")
    public ResponseEntity<List<CategoryNav>> createAllCategoryNav(@RequestBody List<CategoryNav> categoryNav) {
        List<CategoryNav> savedCategoryNav = categoryNavService.saveAllCategoryNav(categoryNav);
        return new ResponseEntity<>(savedCategoryNav, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryNav> getCategoryNavById(@PathVariable Long id) {
        Optional<CategoryNav> categoryNav = categoryNavService.getCategoryNavById(id);
        return categoryNav.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<CategoryNav>> getAllCategoryNav() {
        List<CategoryNav> categoryNaves = categoryNavService.getAllCategoryNav();
        return new ResponseEntity<>(categoryNaves, HttpStatus.OK);
    }

    @GetMapping("/v2")
    public ResponseEntity<Page<CategoryNav>> getAllCategoryNav(Pageable pageable) {
        Page<CategoryNav> categoryNaves = categoryNavService.getAllCategoryNav(pageable);
        return new ResponseEntity<>(categoryNaves, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCategoryNavCount() {
        long count = categoryNavService.getCategoryNavCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoryNavById(@PathVariable Long id) {
        if (categoryNavService.categoryNavExists(id)) {
            categoryNavService.deleteCategoryNavById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/v2")
    public ResponseEntity<CategoryNav> postNavWithFile(@RequestPart("file") MultipartFile file,
                                               @RequestParam("nav") String navString) throws IOException {
        return getCategoryNavResponseEntity(file, navString,null);
    }

    @PutMapping("/{id}/v2")
    public ResponseEntity<CategoryNav> putServicesByIdWithFile(@PathVariable long id,@RequestPart("file") MultipartFile file,
                                                  @RequestParam("nav") String navString) throws IOException {
        logger.info("Request for id {}", id);
        CategoryNav savedNav = categoryNavService.getCategoryNavById(id).orElse(null);
        if(Objects.nonNull(savedNav)){
            return getCategoryNavResponseEntity(file, navString,savedNav);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryNav> putServicesById(@PathVariable Long id, @RequestParam("nav") String navString) throws JsonProcessingException {
        logger.info("Request putServicesById for id {}", id);
        CategoryNav savedNav = categoryNavService.getCategoryNavById(id).orElse(null);
        if(Objects.nonNull(savedNav)){
            return getCategoryNavResponseEntity(null, navString,savedNav);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    private ResponseEntity<CategoryNav> getCategoryNavResponseEntity(MultipartFile file, String navString,CategoryNav savedNav) throws com.fasterxml.jackson.core.JsonProcessingException {
        CategoryNavRequest values = mapper.fromJson(navString, CategoryNavRequest.class);
        CategoryNav categoryNav = null;
        logger.info(" before {},{}", values, savedNav);

        if(Objects.nonNull(savedNav)){
            savedNav.copyValues(values.getCategoryNav());
            categoryNav=savedNav;
        }else{
            categoryNav = categoryNavService.saveCategoryNav(values.getCategoryNav());
        }


        if(Objects.nonNull(file)){
            String storedFileName = fileStorageService.storeFile(file, String.valueOf(categoryNav.getId()), storageDirectory);
            categoryNav.setIcon(storedFileName);
        }



        categoryNav = categoryNavService.addChild(categoryNav,values.getChildren());
        return new ResponseEntity<>(categoryNav, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<Void> servicesToggleActiveById(@PathVariable Long id) {
        CategoryNav savedNav = categoryNavService.getCategoryNavById(id).orElse(null);
        if (Objects.nonNull(savedNav)) {
            logger.info("Service before update{}", savedNav);
            savedNav.setMainNav(!savedNav.isMainNav());
            categoryNavService.saveCategoryNav(savedNav);
            logger.info("Service after update{}", savedNav);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
