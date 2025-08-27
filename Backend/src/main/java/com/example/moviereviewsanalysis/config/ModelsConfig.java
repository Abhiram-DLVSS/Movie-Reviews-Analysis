package com.example.moviereviewsanalysis.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelsConfig {

    @Value("${HF_SUMM_MODEL:https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn}")
    public String hfSummModel;

    @Value("${HF_SA_MODEL:https://router.huggingface.co/hf-inference/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english}")
    public String hfSaModel;
}
