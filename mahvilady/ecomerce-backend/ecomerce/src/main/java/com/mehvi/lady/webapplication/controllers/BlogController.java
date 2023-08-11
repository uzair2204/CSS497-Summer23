package com.mehvi.lady.webapplication.controllers;

import com.mehvi.lady.webapplication.entities.Blog;
import com.mehvi.lady.webapplication.services.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/blogs")
public class BlogController {

    private final BlogService blogService;

    @Autowired
    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping
    public ResponseEntity<Blog> createBlog(@RequestBody Blog blog) {
        Blog savedBlog = blogService.saveBlog(blog);
        return new ResponseEntity<>(savedBlog, HttpStatus.CREATED);
    }

    @PostMapping("/list")
    public ResponseEntity<List<Blog>> createAllBlog(@RequestBody List<Blog> blog) {
        List<Blog> savedBlog = blogService.saveAllBlogs(blog);
        return new ResponseEntity<>(savedBlog, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
        Optional<Blog> blog = blogService.getBlogById(id);
        return blog.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs() {
        List<Blog> blogs = blogService.getAllBlogs();
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getBlogCount() {
        long count = blogService.getBlogCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlogById(@PathVariable Long id) {
        if (blogService.blogExists(id)) {
            blogService.deleteBlogById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
