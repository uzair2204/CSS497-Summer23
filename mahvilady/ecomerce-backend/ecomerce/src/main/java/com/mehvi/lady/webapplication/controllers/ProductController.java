package com.mehvi.lady.webapplication.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mehvi.lady.webapplication.controllers.requests.ProductRequest;
import com.mehvi.lady.webapplication.entities.Brand;
import com.mehvi.lady.webapplication.entities.Category;
import com.mehvi.lady.webapplication.entities.Product;
import com.mehvi.lady.webapplication.entities.Shop;
import com.mehvi.lady.webapplication.repositories.beans.ProductFilterRequest;
import com.mehvi.lady.webapplication.repositories.beans.ProductSearchCriteria;
import com.mehvi.lady.webapplication.services.*;
import com.mehvi.lady.webapplication.utils.CommonUtils;
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
@RequestMapping("/products")
@CrossOrigin
public class ProductController {
    Logger logger = LogManager.getLogger(this.getClass());
    private final ObjectMapperService mapper;
    private final FileStorageService fileStorageService;
    @Value("${file.products.directory}")
    private String storageDirectory;
    private final ProductService productService;
    private final ShopService shopService;
    private final BrandService brandService;
    private final SizeService sizeService;
    private final CategoryService categoryService;

    @Autowired
    public ProductController(ObjectMapperService mapper, FileStorageService fileStorageService, ProductService productService, ShopService shopService, BrandService brandService, SizeService sizeService, CategoryService categoryService) {
        this.mapper = mapper;
        this.fileStorageService = fileStorageService;
        this.productService = productService;
        this.shopService = shopService;
        this.brandService = brandService;
        this.sizeService = sizeService;
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.saveProduct(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }


    @PostMapping("/list")
    public ResponseEntity<List<Product>> createAllProduct(@RequestBody List<Product> product) {
        List<Product> savedProduct = productService.saveAllProducts(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/v2")
    public ResponseEntity<Page<Product>> getAllProducts(Pageable pageable) {
        Page<Product> products = productService.getAllProducts(pageable);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/shops-by-categories")
    public ResponseEntity<Page<Shop>> getShopsByCategories(@RequestParam("categoryIds") List<Long> categoryIds, Pageable pageable) {
        return new ResponseEntity<>(productService.getTopShopsByCategoryIds(categoryIds, pageable), HttpStatus.OK);
    }

    @GetMapping("/by-categories")
    public ResponseEntity<Page<Product>> getProductByCategories(@RequestParam("categoryIds") List<Long> categoryIds, Pageable pageable) {
        return new ResponseEntity<>(productService.getProductsByCategoryIds(categoryIds, pageable), HttpStatus.OK);
    }


    @PostMapping("/by-criteria")
    ResponseEntity<Page<Product>> searchProducts(@RequestBody ProductFilterRequest filterRequest) {
        logger.info(filterRequest);
        return new ResponseEntity<>(productService.searchProducts(filterRequest.getCriteria(), filterRequest.getPageAble()), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> getProductsByNameContaining(@RequestParam("name") String name, Pageable pageable) {
        return new ResponseEntity<>(productService.getProductsByNameContaining(name, pageable), HttpStatus.OK);
    }

    @GetMapping("/brand/{slug}")
    public ResponseEntity<Page<Product>> getByBrandSlug(@PathVariable String slug, Pageable pageable) {
        return new ResponseEntity<>(productService.getProductsByBrandSlug(slug, pageable), HttpStatus.OK);
    }

    @GetMapping("/category/{slug}")
    public ResponseEntity<Page<Product>> getByCategorySlug(@PathVariable String slug, Pageable pageable) {
        return new ResponseEntity<>(productService.getProductsByCategorySlug(slug, pageable), HttpStatus.OK);
    }

    @GetMapping("/suggestion")
    public ResponseEntity<List<String>> getSuggestion(@RequestParam("name") String name, @RequestParam(name = "category", defaultValue = "") String category) {
        return new ResponseEntity<>(productService.getTitles(name, category), HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getProductCount() {
        long count = productService.getProductCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }


    @GetMapping("/exist/slug/{name}")
    public ResponseEntity<Boolean> existSize(@PathVariable String name) {
        boolean exist = productService.slugExist(name);
        return new ResponseEntity<>(exist, HttpStatus.OK);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Product> getBySlug(@PathVariable String slug) {
        Optional<Product> product = productService.getBySlug(slug);
        return product.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/slugs")
    public ResponseEntity<List<String>> getSlugs() {
        return new ResponseEntity<>(productService.getAllSlugs(), HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductById(@PathVariable Long id) {
        if (productService.productExists(id)) {
            productService.deleteProductById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{shopId}/v2")
    public ResponseEntity<Product> postWithFile(@PathVariable("shopId") Long shopId, @RequestPart("images") MultipartFile[] imagesFiles, @RequestPart("thumbnail") MultipartFile thumbnail,
                                                @RequestParam("product") String prdouctString) throws IOException {
        return safeProduct(thumbnail, imagesFiles, null, prdouctString, shopId);

    }

    @PutMapping("{id}/{shopId}/")
    public ResponseEntity<Product> postWithFile(@PathVariable("id") Long id, @PathVariable("shopId") Long shopId,
                                                @RequestParam("product") String productString) throws IOException {

        Product saved = productService.getProductById(id).orElse(null);
        logger.info("Request postWithFile for id {} {}", id, saved);
        if (Objects.nonNull(saved)) {
            return safeProduct(null, null, saved, productString, shopId);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @PutMapping("{id}/{shopId}/both")
    public ResponseEntity<Product> postWithFile(@PathVariable("id") Long id, @PathVariable("shopId") Long shopId, @RequestPart("images") MultipartFile[] imagesFiles, @RequestPart("thumbnail") MultipartFile thumbnail,
                                                @RequestParam("product") String productString) throws IOException {

        Product saved = productService.getProductById(id).orElse(null);
        logger.info("Request postWithFile for id {} {}", id, saved);
        logger.info("Request postWithFile for id {} {}", id, saved);
        if (Objects.nonNull(saved)) {
            return safeProduct(thumbnail, imagesFiles, saved, productString, shopId);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @PutMapping("{id}/{shopId}/thumbnail")
    public ResponseEntity<Product> postWithFile(@PathVariable("id") Long id, @PathVariable("shopId") Long shopId, @RequestPart("thumbnail") MultipartFile thumbnail,
                                                @RequestParam("product") String productString) throws IOException {
        logger.info("Request putServicesById for id {}", id);
        Product saved = productService.getProductById(id).orElse(null);
        logger.info("Request postWithFile for id {} {}", id, saved);
        if (Objects.nonNull(saved)) {
            return safeProduct(thumbnail, null, saved, productString, shopId);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @PutMapping("{id}/{shopId}/images")
    public ResponseEntity<Product> postWithFile(@PathVariable("id") Long id, @PathVariable("shopId") Long shopId, @RequestPart("images") MultipartFile[] imagesFiles,
                                                @RequestParam("product") String productString) throws IOException {
        Product saved = productService.getProductById(id).orElse(null);
        logger.info("Request putServicesById for id {}", id);
        if (Objects.nonNull(saved)) {
            return safeProduct(null, imagesFiles, saved, productString, shopId);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }


    @PutMapping("/{id}/{shopId}")
    public ResponseEntity<Product> putById(@PathVariable Long id, @PathVariable Long shopId, @RequestParam("product") String productString) throws JsonProcessingException {
        logger.info("Request putServicesById for id {}", id);
        Product saved = productService.getProductById(id).orElse(null);
        if (Objects.nonNull(saved)) {
            return safeProduct(null, null, saved, productString, shopId);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    private ResponseEntity<Product> safeProduct(MultipartFile thumbnail, MultipartFile[] images, Product product, String requestString, long shopId) throws JsonProcessingException {
        Shop shop = shopService.getShopById(shopId).orElseGet(() -> null);

        if (Objects.isNull(shop)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        ProductRequest request = mapper.fromJson(requestString, ProductRequest.class);
        logger.info("mapped {},{},{},{}", requestString, shopId, images, request);
        Brand brand = brandService.getBrandById(request.getBrand()).orElseGet(() -> null);
        List<Category> categories = categoryService.getCategoriesByIds(request.getCategories());
        logger.info("before product {},{}", requestString, shopId);

        if (Objects.isNull(brand) || CommonUtils.isNullOrEmptyCollection(categories)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Product savedProduct;


        if (Objects.nonNull(product)) {
            product.copyValues(request.getProduct());

            savedProduct = product;
        } else {
            savedProduct = request.getProduct();
            logger.info("product safe");
        }

        savedProduct.setShop(shop);
        savedProduct.setBrand(brand);
        savedProduct.setCategories(categories);
        savedProduct.setSize(sizeService.getSizesByIds(request.getSizes()));

        logger.info("image product {},{}", savedProduct, product);
        savedProduct = productService.saveProduct(savedProduct);
        if (Objects.nonNull(thumbnail)) {
            savedProduct.setThumbnail(fileStorageService.storeFile(thumbnail, String.valueOf(savedProduct.getId()), storageDirectory));
        }

        if (Objects.nonNull(images)) {
            savedProduct.setImages(fileStorageService.storeFiles(images, String.valueOf(savedProduct.getId()), savedProduct.getImages(), storageDirectory));
        }

        savedProduct = productService.saveProduct(savedProduct);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }


}
