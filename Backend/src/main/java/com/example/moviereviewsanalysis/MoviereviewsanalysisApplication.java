package com.example.moviereviewsanalysis;

import com.example.moviereviewsanalysis.config.KeyConfig;
import com.example.moviereviewsanalysis.config.ModelsConfig;
import com.example.moviereviewsanalysis.dto.MovieUrl;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.ObjectMapper;


@SpringBootApplication
@RestController
public class MoviereviewsanalysisApplication {
    private final ModelsConfig modelsConfig;
    private final KeyConfig keyConfig;

    public MoviereviewsanalysisApplication(ModelsConfig modelsConfig, KeyConfig keyConfig) {
        this.modelsConfig = modelsConfig;
        this.keyConfig = keyConfig;
    }
    public static void main(String[] args) {
		SpringApplication.run(MoviereviewsanalysisApplication.class, args);
	}

    @GetMapping("/getMovieURL")
    public MovieUrl getMovieURL(@RequestParam("movieName") String movieName) {
        System.out.println("Received movie name: " + movieName);
        String query = "Rotten Tomatoes " + movieName;
        String movieurl = "";
        String error = "";
        
        try {
            WebClient client = WebClient.create();
            JsonNode jsonNode = client.get()
                .uri("https://customsearch.googleapis.com/customsearch/v1?cx={googleSearchEngineID}&q={query}&key={key}&num=1", keyConfig.googleSearchEngineID, query, keyConfig.googleSearchKey)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

            if (jsonNode.has("items") && jsonNode.get("items").isArray() && jsonNode.get("items").size() > 0) {
                movieurl = jsonNode.get("items").get(0).get("link").asText();
            }
            System.out.println("Extracted URL: " + movieurl);
        } catch (Exception e) {
            error = "Error retrieving movie URL: " + e.getMessage();
            System.err.println(error);
        }
        
        MovieUrl result = new MovieUrl(movieurl, error);
        return result;
    }

    @GetMapping("/getReviews")
    public MovieUrl getReviews(@RequestParam("movieUrl") String movieUrl) {
        return null;
    }

    @GetMapping("/getSummary")
    public MovieUrl getSummary(@RequestParam("reviewsAggregate") String reviewsAggregate) {
        return null;
    }

    @GetMapping("/getSentimentAnalysis")
    public MovieUrl getSentimentAnalysis(@RequestParam("reviewsList") String[] reviewsList) {
        return null;
    }


    

}