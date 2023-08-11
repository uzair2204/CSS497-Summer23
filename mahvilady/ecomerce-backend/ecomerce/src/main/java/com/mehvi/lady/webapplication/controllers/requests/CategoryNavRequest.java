package com.mehvi.lady.webapplication.controllers.requests;

import com.mehvi.lady.webapplication.entities.CategoryNav;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
public class CategoryNavRequest {
    private Long id;
    private String icon;
    private String title;
    private String href;
    private Integer displayOrder;
    private boolean mainNav;
    private boolean featured;
    private List<Long> children;


    public CategoryNav getCategoryNav(){
        CategoryNav nav= new CategoryNav();
        nav.setIcon(icon);
        nav.setTitle(title);
        nav.setHref(href);
        nav.setDisplayOrder(displayOrder);
        nav.setMainNav(mainNav);
        nav.setFeatured(featured);
        return nav;
    }
}
