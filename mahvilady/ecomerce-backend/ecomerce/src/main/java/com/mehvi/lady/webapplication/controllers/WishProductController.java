package com.mehvi.lady.webapplication.controllers;

import com.mehvi.lady.webapplication.entities.Product;
import com.mehvi.lady.webapplication.entities.WishProduct;
import com.mehvi.lady.webapplication.services.CommonService;
import com.mehvi.lady.webapplication.services.WishProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/wish-list")
@CrossOrigin
public class WishProductController {

    private final CommonService commonService;
    private final WishProductService wishProductService;

    public WishProductController(CommonService commonService, WishProductService wishProductService) {
        this.commonService = commonService;
        this.wishProductService = wishProductService;
    }


    @GetMapping("/count")
    public ResponseEntity<Long> getWishProductCount() {
        long count = wishProductService.getWishProductCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/wishes/{userId}")
    public ResponseEntity<List<WishProduct>> getWish(@PathVariable long userId) {
        List<WishProduct> wishes = wishProductService.getProductFromWishlistByUserId(userId);
        return new ResponseEntity<>(wishes, HttpStatus.OK);
    }

    @GetMapping("/product/{userId}")
    public ResponseEntity<Page<Product>> getWishProducts(Pageable pageable, @PathVariable long userId) {
        Page<Product> count = wishProductService.getAllWishProductsByUserID(pageable, userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }


    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<Void> deleteWishProduct(@PathVariable long userId, @PathVariable long productId) {
        //logger.info("Request for id {}", cartId);
        WishProduct cart = wishProductService.getProductFromWishlist(userId, productId).orElse(null);
        if (Objects.nonNull(cart)) {
            wishProductService.deleteWishProduct(cart);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{userId}/{productId}")
    public ResponseEntity<WishProduct> postWishProduct(@PathVariable long userId, @PathVariable long productId) {
        //logger.info("Request for id {}", cartId);

        if (commonService.wishProduct(userId, productId) && !wishProductService.isProductInWishlist(userId,productId)) {
            WishProduct wishProduct = new WishProduct();
            wishProduct.setProductId(productId);
            wishProduct.setUserId(userId);
            wishProduct = wishProductService.saveWishProduct(wishProduct);
            return new ResponseEntity<>(wishProduct,HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
