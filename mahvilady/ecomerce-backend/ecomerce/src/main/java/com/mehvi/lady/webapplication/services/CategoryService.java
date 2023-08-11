package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Category;
import com.mehvi.lady.webapplication.repositories.CategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Save a single category
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Save a collection of categories
    public List<Category> saveAllCategories(List<Category> categories) {
        return categoryRepository.saveAll(categories);
    }

    // Get an category by its ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Check if an category with the given ID exists in the database
    public boolean categoryExists(Long id) {
        return categoryRepository.existsById(id);
    }

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Page<Category> getAllCategories(Pageable page) {
        return categoryRepository.findAll(page);
    }

    // Get categories by a list of IDs
    public List<Category> getCategoriesByIds(List<Long> ids) {
        return categoryRepository.findAllById(ids);
    }

    // Get the total number of categories in the database
    public long getCategoryCount() {
        return categoryRepository.count();
    }

    // Delete an category by its ID
    public void deleteCategoryById(Long id) {
        categoryRepository.deleteById(id);
    }

    // Delete a single category
    public void deleteCategory(Category category) {
        categoryRepository.delete(category);
    }

    @Transactional
    public Category addChild(Category category, List<Long> childIds) {
        if (Objects.nonNull(category)) {
            categoryRepository.updateParentToZero(category.getId());
            category.getChildren().clear();
            // Add new children to the parent
            List<Category> newChildren = getCategoriesByIds(childIds);
            for (Category newChild : newChildren) {
                category.addChild(newChild);
            }
        }
        return this.saveCategory(category);
    }

    public List<String> getAllNames(){
        return categoryRepository.getAllNames();
    }
}
