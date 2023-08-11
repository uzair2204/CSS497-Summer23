package com.mehvi.lady.webapplication.repositories;

import com.mehvi.lady.webapplication.entities.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
}
