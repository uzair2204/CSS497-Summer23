package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Review;
import com.mehvi.lady.webapplication.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    // Save a single review
    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    // Save a collection of reviews
    public List<Review> saveAllReviews(List<Review> reviews) {
        return reviewRepository.saveAll(reviews);
    }

    // Get a review by its ID
    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    // Check if a review with the given ID exists in the database
    public boolean reviewExists(Long id) {
        return reviewRepository.existsById(id);
    }

    // Get all reviews
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Get reviews by a list of IDs
    public List<Review> getReviewsByIds(List<Long> ids) {
        return reviewRepository.findAllById(ids);
    }

    // Get the total number of reviews in the database
    public long getReviewCount() {
        return reviewRepository.count();
    }

    // Delete n review by its ID
    public void deleteReviewById(Long id) {
        reviewRepository.deleteById(id);
    }

    // Delete a single review
    public void deleteReview(Review review) {
        reviewRepository.delete(review);
    }
}
