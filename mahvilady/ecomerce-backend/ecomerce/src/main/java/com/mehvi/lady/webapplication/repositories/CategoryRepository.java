package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Modifying
    @Query("UPDATE Category c SET c.parent = null WHERE c.parent.id = :parentId")
    void updateParentToZero(@Param("parentId") Long parentId);

    @Query("SELECT c.name FROM Category c")
    List<String> getAllNames();
}
