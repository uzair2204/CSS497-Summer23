package com.mehvi.lady.webapplication.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
@Entity
public class Services {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String icon;
    private String title;
    private String description;
    private boolean active;

    private Integer displayOrder;

    public void copyValues(Services object) {
        icon = object.icon;
        title = object.title;
        description = object.description;
        active = object.active;
        displayOrder = object.displayOrder;
    }
    // getters and setters
}



