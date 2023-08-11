package com.mehvi.lady.webapplication.repositories.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
public class ProductSearchCriteria {
    private Double priceMin;
    private Double priceMax;
    private List<String> brands;
    private Boolean stock;
    private Boolean discount;
    private List<Double> ratings;
    private Boolean featured;
    private String name;

    private List<String> categories;

    private String brandSlug;

    private String categorySlug;

    // Getters and setters
}

