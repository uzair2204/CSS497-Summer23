package com.mehvi.lady.webapplication.controllers.requests;

import com.mehvi.lady.webapplication.entities.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
public class CategoryRequest {
    private Long id;
    private String name;
    private String slug;
    private String icon;
    private boolean featured;
    private boolean mainCategory;
    private String description;
    private List<Long> children;

    public Category getCategory(){
        Category nav= new Category();
        nav.setIcon(icon);
        nav.setName(name);
        nav.setSlug(slug);
        nav.setFeatured(featured);
        nav.setMainCategory(mainCategory);
        nav.setDescription(description);
        return nav;
    }
}
