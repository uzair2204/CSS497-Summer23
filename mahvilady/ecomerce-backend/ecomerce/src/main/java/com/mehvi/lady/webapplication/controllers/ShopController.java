package com.mehvi.lady.webapplication.controllers;

import com.mehvi.lady.webapplication.entities.Shop;
import com.mehvi.lady.webapplication.services.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/shops")
public class ShopController {

    private final ShopService shopService;

    @Autowired
    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @PostMapping
    public ResponseEntity<Shop> createShop(@RequestBody Shop shop) {
        Shop savedShop = shopService.saveShop(shop);
        return new ResponseEntity<>(savedShop, HttpStatus.CREATED);
    }

    @PostMapping("/list")
    public ResponseEntity<List<Shop>> createAllShop(@RequestBody List<Shop> shop) {
        List<Shop> savedShop = shopService.saveAllShops(shop);
        return new ResponseEntity<>(savedShop, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shop> getShopById(@PathVariable Long id) {
        Optional<Shop> shop = shopService.getShopById(id);
        return shop.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Shop>> getAllShops() {
        List<Shop> shops = shopService.getAllShops();
        return new ResponseEntity<>(shops, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getShopCount() {
        long count = shopService.getShopCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShopById(@PathVariable Long id) {
        if (shopService.shopExists(id)) {
            shopService.deleteShopById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
