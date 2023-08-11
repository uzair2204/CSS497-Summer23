package com.mehvi.lady.webapplication.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
@Entity
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String slug;
    @OneToOne
    @JsonIgnore
    private User user;
    private String email;
    private String name;
    private String phone;
    private String address;
    private Double rating;
    private boolean verified;

    @OneToMany(fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products;

    private String coverPicture;
    private String profilePicture;

    @ElementCollection
    private Map<String, String> socialLinks;

    // getters and setters
}



