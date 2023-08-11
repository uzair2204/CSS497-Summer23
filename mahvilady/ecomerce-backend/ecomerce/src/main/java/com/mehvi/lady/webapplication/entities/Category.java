package com.mehvi.lady.webapplication.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
@Entity
@EqualsAndHashCode(exclude = {"children"})
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String slug;
    private String icon;
    private boolean featured;
    private boolean mainCategory;
    private String description;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    private Category parent;

    @OneToMany(mappedBy = "parent" , cascade = CascadeType.ALL)
    private List<Category> children = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products;

    public void copyValues(Category category) {
        icon=category.icon;
        name=category.name;
        slug=category.slug;
        featured=category.featured;
        mainCategory=category.mainCategory;
        description=category.description;

    }

    public void addChild(Category child) {
        if (Objects.nonNull(child)) {
            child.setParent(this);
            children.add(child);
        }
    }
    // getters and setters
}

// Need to represent CategoryItem differently because of potential infinite recursion



