package com.mehvi.lady.webapplication.controllers;

import com.mehvi.lady.webapplication.entities.Review;
import com.mehvi.lady.webapplication.services.CommonService;
import com.mehvi.lady.webapplication.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reviews")
@CrossOrigin
public class ReviewController {

    private final ReviewService reviewService;

    private final CommonService commonService;

    @Autowired
    public ReviewController(ReviewService reviewService, CommonService commonService) {
        this.reviewService = reviewService;
        this.commonService = commonService;
    }

    @PostMapping("/{productId}/{userId}")
    public ResponseEntity<Review> createReview(@RequestBody Review review,@PathVariable long productId, @PathVariable long userId) {
        Review savedReview = commonService.reviewProduct(review,productId,userId);
        return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        Optional<Review> review = reviewService.getReviewById(id);
        return review.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getReviewCount() {
        long count = reviewService.getReviewCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReviewById(@PathVariable Long id) {
        if (reviewService.reviewExists(id)) {
            reviewService.deleteReviewById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
