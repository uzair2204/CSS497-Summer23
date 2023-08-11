package com.mehvi.lady.webapplication.controllers.requests;

import com.mehvi.lady.webapplication.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Setter
public class ProductRequest {
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
    private Double rating;
    private Integer stock;

    public List<Long> sizes;
    public List<Long> categories;
    public Long brand;

    public Product getProduct(){
        Product product =  new Product();
        product.setTitle(title);
        product.setDescription( description);
        product.setSlug( slug);
        product.setPrice( price);
        product.setRetailPrice( retailPrice);
        product.setSalePrice( salePrice);
        product.setDiscount( discount);
        product.setStatus( status);
        product.setPublished( published);
        product.setOnDiscount( onDiscount);
        product.setStock(stock);
        return  product;
    }
}
