package com.mehvi.lady.webapplication.repositories.beans;

import com.mehvi.lady.webapplication.entities.Product;
import com.mehvi.lady.webapplication.utils.CommonUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Predicate;

public class ProductSpecification {
    Logger logger = LogManager.getLogger(this.getClass());

    public static Specification<Product> withCriteria(ProductSearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (!CommonUtils.isNullOrEmptyString(criteria.getName())) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%"+criteria.getName().toLowerCase()+"%"));
            }
            if (criteria.getPriceMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), criteria.getPriceMin()));
            }

            if (criteria.getPriceMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), criteria.getPriceMax()));
            }

            if (criteria.getBrands() != null && !criteria.getBrands().isEmpty()) {
                predicates.add(root.get("brand").get("name").in(criteria.getBrands()));
            }


            if (criteria.getCategories() != null && !criteria.getCategories().isEmpty()) {
                predicates.add(root.get("categories").get("name").in(criteria.getBrands()));
            }

            if (criteria.getStock() != null && criteria.getStock()) {
                predicates.add(cb.greaterThan(root.get("stock"), 0));
            }

            if (criteria.getDiscount() != null && criteria.getDiscount()) {
                predicates.add(cb.equal(root.get("onDiscount"), criteria.getDiscount()));
            }

            if (criteria.getRatings() != null && !criteria.getRatings().isEmpty()) {
                predicates.add(cb.round(root.get("rating"),0).in(criteria.getRatings()));
            }
            if (!CommonUtils.isNullOrEmptyString(criteria.getCategorySlug())) {
                predicates.add(cb.equal(root.get("categories").get("slug"),criteria.getCategorySlug()));
            }
            if (!CommonUtils.isNullOrEmptyString(criteria.getBrandSlug())) {
                predicates.add(cb.equal(root.get("brand").get("slug"),criteria.getBrandSlug()));
            }


            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
