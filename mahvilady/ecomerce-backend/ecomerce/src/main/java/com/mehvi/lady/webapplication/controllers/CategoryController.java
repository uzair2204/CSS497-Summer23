package com.mehvi.lady.webapplication.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mehvi.lady.webapplication.controllers.requests.CategoryRequest;
import com.mehvi.lady.webapplication.entities.Category;
import com.mehvi.lady.webapplication.services.CategoryService;
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
@RequestMapping("/categories")
@CrossOrigin
public class CategoryController {

    private final CategoryService categoryService;
    Logger logger = LogManager.getLogger(this.getClass());
    private final ObjectMapperService mapper;
    private final FileStorageService fileStorageService;
    @Value("${file.category.directory}")
    private String storageDirectory;

    @Autowired
    public CategoryController(CategoryService categoryService, ObjectMapperService mapper, FileStorageService fileStorageService) {
        this.categoryService = categoryService;
        this.mapper = mapper;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category savedCategory = categoryService.saveCategory(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }

    @PostMapping("/list")
    public ResponseEntity<List<Category>> createAllCategory(@RequestBody List<Category> category) {
        List<Category> savedCategory = categoryService.saveAllCategories(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategory() {
        List<Category> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/names")
    public ResponseEntity<List<String>> getAllCategoryNames() {
        List<String> categories = categoryService.getAllNames();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }


    @GetMapping("/v2")
    public ResponseEntity<Page<Category>> getAllCategory(Pageable pageable) {
        Page<Category> categories = categoryService.getAllCategories(pageable);
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCategoryCount() {
        long count = categoryService.getCategoryCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoryById(@PathVariable Long id) {
        if (categoryService.categoryExists(id)) {
            categoryService.deleteCategoryById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/v2")
    public ResponseEntity<Category> postNavWithFile(@RequestPart("file") MultipartFile file,
                                                    @RequestParam("object") String navString) throws IOException {
        return getCategoryResponseEntity(file, navString,null);
    }

    @PutMapping("/{id}/v2")
    public ResponseEntity<Category> putServicesByIdWithFile(@PathVariable long id,@RequestPart("file") MultipartFile file,
                                                            @RequestParam("object") String navString) throws IOException {
        logger.info("Request for id {}", id);
        Category savedNav = categoryService.getCategoryById(id).orElse(null);
        if(Objects.nonNull(savedNav)){
            return getCategoryResponseEntity(file, navString,savedNav);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> putServicesById(@PathVariable Long id, @RequestParam("object") String navString) throws JsonProcessingException {
        logger.info("Request putServicesById for id {}", id);
        Category savedNav = categoryService.getCategoryById(id).orElse(null);
        if(Objects.nonNull(savedNav)){
            return getCategoryResponseEntity(null, navString,savedNav);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    private ResponseEntity<Category> getCategoryResponseEntity(MultipartFile file, String navString,Category savedNav) throws com.fasterxml.jackson.core.JsonProcessingException {
        CategoryRequest values = mapper.fromJson(navString, CategoryRequest.class);
        Category category = null;
        logger.info(" before {},{}", values, savedNav);

        if(Objects.nonNull(savedNav)){
            savedNav.copyValues(values.getCategory());
            category=savedNav;
        }else{
            category = categoryService.saveCategory(values.getCategory());
        }

        if(Objects.nonNull(file)){
            String storedFileName = fileStorageService.storeFile(file, String.valueOf(category.getId()), storageDirectory);
            category.setIcon(storedFileName);
        }



        category = categoryService.addChild(category,values.getChildren());
        return new ResponseEntity<>(category, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<Void> servicesToggleActiveById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id).orElse(null);
        if (Objects.nonNull(category)) {
            logger.info("Service before update{}", category);
            category.setMainCategory(!category.isMainCategory());
            categoryService.saveCategory(category);
            logger.info("Service after update{}", category);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
