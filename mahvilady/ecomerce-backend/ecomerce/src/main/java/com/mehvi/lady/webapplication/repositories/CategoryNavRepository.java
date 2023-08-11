package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.CategoryNav;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryNavRepository extends JpaRepository<CategoryNav, Long> {

    @Modifying
    @Query("UPDATE CategoryNav c SET c.parent = null WHERE c.parent.id = :parentId")
    void updateParentToZero(@Param("parentId") Long parentId);
}
