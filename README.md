# Movie Reviews Summarization and Sentiment Analysis

## Demo
Try out the application at Heroku: https://movie-reviews-687da07d5dc8.herokuapp.com/

Screenshot:
<img src='https://github.com/Abhiram-DLVSS/MovieReviewsAnalysis/assets/58914306/9fe89411-ceb3-4e36-8e2d-484b7767f0a1'>

## How it works
1. Searches for `Rotten Tomatoes ${query}` on google and retrieves the URL of the top result.
2. Scrapes the Rotten Tomatoes website for the top critic reviews using Selenium.
3. Uses Hugging Face Inference API to generate the summary and perform the sentiment analysis of the movie reviews.

## Summarization Model
Model: [https://huggingface.co/abhiramd22/t5-base-finetuned-to-summarize-movie-reviews](https://huggingface.co/abhiramd22/t5-base-finetuned-to-summarize-movie-reviews)

This is based on `t5-base` model, fine-tuned using a custom-built movie reviews dataset.

## Sentiment Analysis Model
Model: [https://huggingface.co/abhiramd22/finetuning-sentiment-model-mpnet-imdb](https://huggingface.co/abhiramd22/finetuning-sentiment-model-mpnet-imdb)

This is based on `all-mpnet-base-v2` model, fine-tuned using the IMDB movie reviews dataset.
