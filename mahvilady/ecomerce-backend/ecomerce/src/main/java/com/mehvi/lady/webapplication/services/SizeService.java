package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Size;
import com.mehvi.lady.webapplication.repositories.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SizeService {

    private final SizeRepository sizeRepository;

    @Autowired
    public SizeService(SizeRepository sizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    // Save a single size
    public Size saveSize(Size size) {
        return sizeRepository.save(size);
    }

    // Save a collection of sizes
    public List<Size> saveAllSizes(List<Size> sizes) {
        return sizeRepository.saveAll(sizes);
    }

    // Get size by its ID
    public Optional<Size> getSizeById(Long id) {
        return sizeRepository.findById(id);
    }

    // Check if size with the given ID exists in the database
    public boolean sizeExists(Long id) {
        return sizeRepository.existsById(id);
    }
    public boolean sizeExists(String name) {
        return sizeRepository.existsByName(name);
    }
    // Get all sizes
    public List<Size> getAllSizes() {
        return sizeRepository.findAll();
    }

    public Page<Size> getAllSizes(Pageable pageable) {
        return sizeRepository.findAll(pageable);
    }

    // Get sizes by a list of IDs
    public List<Size> getSizesByIds(List<Long> ids) {
        return sizeRepository.findAllById(ids);
    }

    // Get the total number of sizes in the database
    public long getSizeCount() {
        return sizeRepository.count();
    }

    // Delete an size by its ID
    public void deleteSizeById(Long id) {
        sizeRepository.deleteById(id);
    }

    // Delete a single size
    public void deleteSize(Size size) {
        sizeRepository.delete(size);
    }
}
