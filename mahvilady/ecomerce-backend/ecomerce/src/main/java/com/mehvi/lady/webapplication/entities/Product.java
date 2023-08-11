package com.mehvi.lady.webapplication.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String slug;
    private Double price;
    private Double retailPrice;
    private Double salePrice;
    private Double discount;
    private String thumbnail;
    private String status;
    private boolean published;
    private boolean onDiscount;
    private double rating;
    private Integer stock;
    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private int reviewCount;
    @CreationTimestamp
    private LocalDateTime creationTimeStamp;

    @ElementCollection
    private List<String> images = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "product_size",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "size_id"))
    private List<Size> size;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "product_category",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;

    @OneToMany(mappedBy = "product")
    private List<Review> reviews;

    public void copyValues(Product object) {
        title = object.title;
        description = object.description;
        slug = object.slug;
        price = object.price;
        retailPrice = object.retailPrice;
        salePrice = object.salePrice;
        discount = object.discount;
        status = object.status;
        published = object.published;
        onDiscount = object.onDiscount;
        stock = object.stock;
    }

    public void updateRating(short rating) {

        double ratingNew = (this.rating * reviewCount) + rating;
        reviewCount++;
        this.rating = ratingNew / reviewCount;
    }
}



