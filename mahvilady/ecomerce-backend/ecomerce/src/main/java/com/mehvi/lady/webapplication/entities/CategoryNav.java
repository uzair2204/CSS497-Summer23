package com.mehvi.lady.webapplication.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mehvi.lady.webapplication.utils.CommonUtils;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
@EqualsAndHashCode(exclude = {"children"})
@Entity
public class CategoryNav {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String icon;
    private String title;
    private String href;
    private Integer displayOrder;
    private boolean mainNav;
    private boolean featured;

    @ManyToOne(cascade = CascadeType.ALL)
    @JsonIgnore
    private CategoryNav parent;

    @OneToMany(mappedBy = "parent" , cascade = CascadeType.ALL)
    private List<CategoryNav> children = new ArrayList<>();

    public void addChild(CategoryNav child) {
        if (Objects.nonNull(child)) {
            child.setParent(this);
            children.add(child);
        }
    }


    public void copyValues(CategoryNav object) {
        icon = object.icon;
        title = object.title;
        children = object.children;
        featured = object.featured;
        mainNav = object.mainNav;
        displayOrder = object.displayOrder;
    }

    @Override
    public String toString() {
        return "CategoryNav{" +
                "id=" + id +
                ", icon='" + icon + '\'' +
                ", title='" + title + '\'' +
                ", href='" + href + '\'' +
                ", displayOrder=" + displayOrder +
                ", parent=" + parent +
                ", featured=" + featured +
                ", mainNav=" + mainNav +
                '}';
    }

    public void removeChild(CategoryNav child) {
        if (Objects.nonNull(child)) {
            child.setParent(null);
            children.add(child);
        }
    }
}
