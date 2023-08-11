package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Blog;
import com.mehvi.lady.webapplication.repositories.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogService {

    private final BlogRepository blogRepository;

    @Autowired
    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    // Save a single blog
    public Blog saveBlog(Blog blog) {
        return blogRepository.save(blog);
    }

    // Save a collection of blog
    //s
    public List<Blog> saveAllBlogs(List<Blog> blogs) {
        return blogRepository.saveAll(blogs);
    }

    // Get a blog by its ID
    public Optional<Blog> getBlogById(Long id) {
        return blogRepository.findById(id);
    }

    // Check if a blog with the given ID exists in the database
    public boolean blogExists(Long id) {
        return blogRepository.existsById(id);
    }

    // Get all blogs
    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    // Get Blogs by a list of IDs
    public List<Blog> getBlogsByIds(List<Long> ids) {
        return blogRepository.findAllById(ids);
    }

    // Get the total number of Blogs in the database
    public long getBlogCount() {
        return blogRepository.count();
    }

    // Delete an blog by its ID
    public void deleteBlogById(Long id) {
        blogRepository.deleteById(id);
    }

    // Delete a single blog
    public void deleteBlog(Blog blog) {
        blogRepository.delete(blog);
    }
}
