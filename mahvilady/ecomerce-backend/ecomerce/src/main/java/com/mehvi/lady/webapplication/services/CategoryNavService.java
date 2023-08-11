package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.CategoryNav;
import com.mehvi.lady.webapplication.repositories.CategoryNavRepository;
import com.mehvi.lady.webapplication.utils.CommonUtils;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.*;

@Service
public class CategoryNavService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final CategoryNavRepository categoryNavRepository;

    @Autowired
    public CategoryNavService(CategoryNavRepository categoryNavRepository) {
        this.categoryNavRepository = categoryNavRepository;
    }

    // Save a single categoryNav
    public CategoryNav saveCategoryNav(CategoryNav categoryNav) {
        return categoryNavRepository.save(categoryNav);
    }

    // Save a collection of categoryNav
    public List<CategoryNav> saveAllCategoryNav(List<CategoryNav> categoryNav) {
        return categoryNavRepository.saveAll(categoryNav);
    }

    // Get an categoryNav by its ID
    public Optional<CategoryNav> getCategoryNavById(Long id) {
        return categoryNavRepository.findById(id);
    }

    // Check if an categoryNav with the given ID exists in the database
    public boolean categoryNavExists(Long id) {
        return categoryNavRepository.existsById(id);
    }

    // Get all categoryNav
    public List<CategoryNav> getAllCategoryNav() {
        return categoryNavRepository.findAll();
    }

    public Page<CategoryNav> getAllCategoryNav(Pageable pageable) {
        return categoryNavRepository.findAll(pageable);
    }
    // Get categoryNav by a list of IDs
    public List<CategoryNav> getCategoryNavByIds(List<Long> ids) {
        return categoryNavRepository.findAllById(ids);
    }

    // Get the total number of categoryNav in the database
    public long getCategoryNavCount() {
        return categoryNavRepository.count();
    }

    // Delete an categoryNav by its ID
    public void deleteCategoryNavById(Long id) {
        categoryNavRepository.deleteById(id);
    }

    // Delete a single categoryNav
    public void deleteCategoryNav(CategoryNav categoryNav) {
        categoryNavRepository.delete(categoryNav);
    }

    @Transactional
    public CategoryNav addChild(CategoryNav parent, List<Long> childIds) {
        if (Objects.nonNull(parent)) {
            categoryNavRepository.updateParentToZero(parent.getId());
            parent.getChildren().clear();
            // Add new children to the parent
            List<CategoryNav> newChildren = getCategoryNavByIds(childIds);
            for (CategoryNav newChild : newChildren) {
                parent.addChild(newChild);
            }

            logger.info("child {}", parent.getChildren());
        }
        return this.saveCategoryNav(parent);
    }
}
