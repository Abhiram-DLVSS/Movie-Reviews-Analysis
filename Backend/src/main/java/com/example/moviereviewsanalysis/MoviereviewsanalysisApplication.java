package com.example.moviereviewsanalysis;

import com.example.moviereviewsanalysis.config.KeyConfig;
import com.example.moviereviewsanalysis.config.ModelsConfig;
import com.example.moviereviewsanalysis.dto.MovieReviews;
import com.example.moviereviewsanalysis.dto.MovieUrl;
import com.example.moviereviewsanalysis.dto.SentimentAnalysisRequest;
import com.example.moviereviewsanalysis.dto.SummarizationRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.util.*;


@SpringBootApplication
@RestController
@CrossOrigin(origins = "*")
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

            if (jsonNode.has("items") && jsonNode.get("items").isArray() && !jsonNode.get("items").isEmpty()) {
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
    public MovieReviews getReviews(@RequestParam("movieUrl") String movieUrl) {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--no-sandbox");
        options.addArguments("log-level=3");

        WebDriver driver = new ChromeDriver(options);
        try {
            driver.get(movieUrl+"/reviews?type=top_critics");
            List<WebElement> reviews = driver.findElements(By.className("review-text"));

            List<String> reviewsList = new ArrayList<String>();
            String reviewsAggregate = "";
            for (WebElement review : reviews) {
                reviewsList.add(review.getText());
                reviewsAggregate+=review.getText();
                reviewsAggregate+="\n";
            }


            return new MovieReviews(reviewsList, reviewsAggregate, "");

        }
        catch (Exception e) {
            String error = "Error retrieving movie URL: " + e.getMessage();
            return new MovieReviews(new ArrayList<String>(0), "", error);
        }
        finally {
            driver.quit();
        }
    }

    @PostMapping("/getSummary")
    public JsonNode getSummary(@RequestBody SummarizationRequest summarizationRequest) {
        try{
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("inputs", "summarize: " + summarizationRequest.reviewsAggregate);
            WebClient client = WebClient.create();
            JsonNode jsonNode = client.post()
                    .uri(modelsConfig.hfSummModel)
                    .header("Authorization", keyConfig.hfApiKey)
                     .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            return jsonNode;
        } catch (Exception e) {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode errorNode = mapper.createObjectNode();
            errorNode.put("error", e.getMessage());
            return errorNode;
        }

    }

    @PostMapping("/getSentimentAnalysis")
    public JsonNode getSentimentAnalysis(@RequestBody SentimentAnalysisRequest sentimentAnalysisRequest) {
        try{
            Map<String, List<String>> requestBody = new HashMap<>();

            requestBody.put("inputs", sentimentAnalysisRequest.reviewsList);
//            System.out.println();
            WebClient client = WebClient.create();
            JsonNode jsonNode = client.post()
                    .uri(modelsConfig.hfSaModel)
                    .header("Authorization", keyConfig.hfApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            return jsonNode;
        } catch (Exception e) {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode errorNode = mapper.createObjectNode();
            errorNode.put("error", e.getMessage());
            return errorNode;
        }
    }


    

}