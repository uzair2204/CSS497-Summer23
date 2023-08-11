package com.mehvi.lady.webapplication.controllers;


import com.mehvi.lady.webapplication.controllers.requests.CartRequest;
import com.mehvi.lady.webapplication.entities.Cart;
import com.mehvi.lady.webapplication.entities.Category;
import com.mehvi.lady.webapplication.services.CartService;
import com.mehvi.lady.webapplication.services.CommonService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
@CrossOrigin
public class CartController {
    private final CommonService commonService;
    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService, CommonService commonService) {
        this.cartService = cartService;
        this.commonService = commonService;
    }



    @PostMapping("/{userId}")
    public ResponseEntity<Cart> createCart(@RequestBody CartRequest cartRequest,@PathVariable long userId) {
        Cart cart = commonService.getCart(cartRequest,userId);
        Cart savedCart = cartService.saveCart(cart);
        return new ResponseEntity<>(savedCart, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Cart>> getAllCartsByUserId(@PathVariable long userId) {
        List<Cart> carts = cartService.getCartsByUserId(userId);
        return new ResponseEntity<>(carts, HttpStatus.OK);
    }

    @PutMapping("/{userId}/{productId}/{quantity}")
    public ResponseEntity<Cart> updateCard(@PathVariable long userId,@PathVariable long productId,@PathVariable int quantity) {

        //logger.info("Request for id {}", cartId);
        Cart cart = cartService.getCartsByProductIdAndUserId(productId,userId).orElse(null);
        if(Objects.nonNull(cart)){
            cart.setQty(quantity);
            cart = cartService.saveCart(cart);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cart> getCartById(@PathVariable Long id) {
        Optional<Cart> cart = cartService.getCartById(id);
        return cart.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Cart>> getAllCarts() {
        List<Cart> carts = cartService.getAllCarts();
        return new ResponseEntity<>(carts, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCartCount() {
        long count = cartService.getCartCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCartById(@PathVariable Long id) {
        if (cartService.cartExists(id)) {
            cartService.deleteCartById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<Void> deleteCart(@PathVariable long userId,@PathVariable long productId) {
        //logger.info("Request for id {}", cartId);
        Cart cart = cartService.getCartsByProductIdAndUserId(productId,userId).orElse(null);
        if (Objects.nonNull(cart)) {
            cartService.deleteCart(cart);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
