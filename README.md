# Movie Review Summarization

## Demo
Visit the website hosted on Heroku: https://movie-reviews-687da07d5dc8.herokuapp.com/

## Model
Model: https://huggingface.co/abhiramd22/t5-base-finetuned-to-summarize-movie-reviews

This is based on `t5-base` model fine-tuned using custom-built movie reviews dataset.

## How it works
1. Searches for `Rotten Tomatoes ${query}` on google and fetches the URL of the top result.
2. Web Scraping the Rotten Tomatoes website for the reviews using Selenium.
3. Uses Hugging Face Inference API to summarize the movie reviews.
