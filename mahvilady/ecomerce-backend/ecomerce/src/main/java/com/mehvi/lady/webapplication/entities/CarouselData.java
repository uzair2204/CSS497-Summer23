package com.mehvi.lady.webapplication.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.CrossOrigin;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
@Entity
@CrossOrigin
public class CarouselData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String imgUrl;
    private String subTitle;
    private String buttonText;
    private String buttonLink;
    private String description;
    private int displayOrder;

    private boolean active;

    // getters and setters

    public void copyValues(CarouselData object){
        title = object.title;
        subTitle = object.subTitle;
        buttonText = object.buttonText;
        buttonLink = object.buttonLink;
        description = object.description;
        displayOrder = object.displayOrder;
        active = object.active;
    }
}



