package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.Product;
import com.mehvi.lady.webapplication.entities.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> , JpaSpecificationExecutor<Product> {

    boolean existsByTitleIgnoreCase(String title);
    boolean existsBySlugIgnoreCase(String slug);

    Optional<Product> getBySlug(String slug);



    @Query("SELECT p.slug FROM Product p")
    List<String> getAllSlugs();

    @Query("SELECT DISTINCT p.shop FROM Product p JOIN p.categories c WHERE c.id IN :categoryIds " +
            "GROUP BY p.shop ORDER BY COUNT(p.shop) DESC")
    Page<Shop> findTopShopsByCategoryIds(@Param("categoryIds") List<Long> categoryIds, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p JOIN p.categories c WHERE c.id IN :categoryIds ")
    Page<Product> findProductByCategoryIds(@Param("categoryIds") List<Long> categoryIds, Pageable pageable);

    @Query("SELECT DISTINCT p.shop FROM Product p JOIN p.categories c WHERE c.id IN :categoryIds")
    List<Shop> findShopsByCategoryIds(@Param("categoryIds") List<Long> categoryIds);

    @Query("SELECT p FROM Product p WHERE LOWER(p.title) LIKE %:keyword%")
    Page<Product> findProductsByNameContaining(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.categories c WHERE c.slug = :slug")
    Page<Product> findProductsByCategorySlug(@Param("slug") String slug, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.brand b WHERE b.slug = :slug")
    Page<Product> findProductsByBrandSlug(@Param("slug") String slug, Pageable pageable);

    @Query("SELECT p.title FROM Product p JOIN p.categories c WHERE c.name like %:categoryName% and p.title like %:title%" )
    List<String> getTitlesSuggestionByCategory(@Param("categoryName") String categoryName, @Param("title") String  title);

    @Query("SELECT p.title FROM Product p WHERE p.title like %:title%" )
    List<String> getTitlesSuggestion(@Param("title") String  title);


}
