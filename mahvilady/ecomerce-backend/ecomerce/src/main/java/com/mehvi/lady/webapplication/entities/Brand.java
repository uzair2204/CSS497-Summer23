package com.mehvi.lady.webapplication.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
@Entity
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String slug;
    private String type;
    private String image;
    private boolean featured;
    private boolean active;
    @OneToMany(fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products;

    // getters and setters

    public void copyValues(Brand obj){
        name=obj.getName();
        slug=obj.getSlug();
        featured= obj.featured;
        active= obj.active;
    }
}



