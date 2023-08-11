package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Brand;
import com.mehvi.lady.webapplication.repositories.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    @Autowired
    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    // Save a single brand
    public Brand saveBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    // Save a collection of brandes
    public List<Brand> saveAllBrands(List<Brand> brands) {
        return brandRepository.saveAll(brands);
    }

    // Get a brand by its ID
    public Optional<Brand> getBrandById(Long id) {
        return brandRepository.findById(id);
    }

    // Check if a brand with the given ID exists in the database
    public boolean brandExists(Long id) {
        return brandRepository.existsById(id);
    }

    // Get all brandes
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public List<String> getAllBrandsNames() {
        return brandRepository.getAllNames();
    }
    public Page<Brand> getAllBrands(Pageable page) {
        return brandRepository.findAll(page);
    }

    // Get brandes by a list of IDs
    public List<Brand> getBrandsByIds(List<Long> ids) {
        return brandRepository.findAllById(ids);
    }

    // Get the total number of brandes in the database
    public long getBrandCount() {
        return brandRepository.count();
    }

    // Delete a brand by its ID
    public void deleteBrandById(Long id) {
        brandRepository.deleteById(id);
    }

    // Delete a single brand
    public void deleteBrand(Brand brand) {
        brandRepository.delete(brand);
    }
}
