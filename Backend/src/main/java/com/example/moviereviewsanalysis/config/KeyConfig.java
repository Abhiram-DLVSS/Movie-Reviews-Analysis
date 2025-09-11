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

    @Value("${CHROME_DRIVER_VERSION:139.0.7258.154}")
    public String chromerDriverVersion;
}
