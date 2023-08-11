package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Shop;
import com.mehvi.lady.webapplication.repositories.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShopService {

    private final ShopRepository shopRepository;

    @Autowired
    public ShopService(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    // Save a single shop
    public Shop saveShop(Shop shop) {
        return shopRepository.save(shop);
    }

    // Save a collection of shops
    public List<Shop> saveAllShops(List<Shop> shops) {
        return shopRepository.saveAll(shops);
    }

    // Get a shop by its ID
    public Optional<Shop> getShopById(Long id) {
        return shopRepository.findById(id);
    }

    // Check if a shop with the given ID exists in the database
    public boolean shopExists(Long id) {
        return shopRepository.existsById(id);
    }

    // Get all shops
    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    // Get shops by a list of IDs
    public List<Shop> getShopsByIds(List<Long> ids) {
        return shopRepository.findAllById(ids);
    }

    // Get the total number of shops in the database
    public long getShopCount() {
        return shopRepository.count();
    }

    // Delete a shop by its ID
    public void deleteShopById(Long id) {
        shopRepository.deleteById(id);
    }

    // Delete a single shop
    public void deleteShop(Shop shop) {
        shopRepository.delete(shop);
    }
}
