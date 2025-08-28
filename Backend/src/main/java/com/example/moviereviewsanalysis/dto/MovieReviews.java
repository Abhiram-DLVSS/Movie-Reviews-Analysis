package com.example.moviereviewsanalysis.dto;

import java.util.List;

public class MovieReviews {
    private List<String> reviewsList;
    private String reviewsAggregate;
    private Number numOfReviews;
    private String error;

    public MovieReviews(List<String> reviewsList, String reviewsAggregate, Number numOfReviews, String error) {
        this.reviewsList = reviewsList;
        this.reviewsAggregate = reviewsAggregate;
        this.numOfReviews = numOfReviews;
        this.error = error;
    }

    // Getters
    public List<String> getReviewsList() {
        return reviewsList;
    }

    public String getReviewsAggregate() {
        return reviewsAggregate;
    }

    public Number getNumOfReviews() {
        return numOfReviews;
    }

    public String getError() {
        return error;
    }

    // Setters
    public void setReviewsList(List<String> reviewsList) {
        this.reviewsList = reviewsList;
    }

    public void setReviewsAggregate() {
        this.reviewsAggregate = reviewsAggregate;
    }

    public void setNumOfReviews() {
        this.numOfReviews = numOfReviews;
    }


    public void setError(String error) {
        this.error = error;
    }
}