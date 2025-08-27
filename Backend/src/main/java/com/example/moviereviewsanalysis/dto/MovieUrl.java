package com.example.moviereviewsanalysis.dto;

public class MovieUrl {
    private String movieUrl;
    private String error;

    public MovieUrl(String movieUrl, String error) {
        this.movieUrl = movieUrl;
        this.error = error;
    }

    // Getters
    public String getMovieUrl() {
        return movieUrl;
    }

    public String getError() {
        return error;
    }

    // Setters
    public void setMovieUrl(String movieUrl) {
        this.movieUrl = movieUrl;
    }

    public void setError(String error) {
        this.error = error;
    }
}