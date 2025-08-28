package com.example.moviereviewsanalysis.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeyConfig {
    @Value("${GOOGLE_SEARCH_KEY}")
    public String googleSearchKey;


    @Value("${GOOGLE_SEARCH_ENGINE_ID}")
    public String googleSearchEngineID;

    @Value("${HF_KEY}")
    public String hfApiKey;
}
