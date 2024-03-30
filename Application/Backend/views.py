from flask import Blueprint,render_template,request
from googlesearch import search
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import requests
import os
import time

views = Blueprint('views',__name__)


@views.route('/')
def welcome():
    return render_template("app.html")

@views.route('/getMovieURL', methods=['POST'])
def getMovieURL():
    if request.method == "POST":
        movieName=request.form.get('movieName')
        query = "Rotten Tomatoes "+movieName
        return {"movie_url":next(search(query, tld="co.in", num=1, stop=1, pause=2))}

@views.route('/getReviews', methods=['POST'])
def getReviews():
    if request.method == "POST":
        movie_url=request.form.get('movie_url')
        s=Service(ChromeDriverManager().install())
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--no-sandbox")
        if(os.environ.get("isheroku")!=None):
            s=Service(executable_path=os.environ.get("CHROMEDRIVER_PATH"))
            chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
        else:
            s=Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=s, options =chrome_options)
        driver.get('{}/reviews'.format(movie_url))
        reviews = driver.find_elements(By.CLASS_NAME, 'review-text')
        reviewsList = []
        reviewsAggregate = ''
        for p in range(len(reviews)):
            reviewsList.append(reviews[p].text)
            reviewsAggregate+=reviews[p].text
            reviewsAggregate+='\n'
        return {"status":200, "reviewsAggregate":reviewsAggregate, "reviewsList":reviewsList, "numOfReviews":len(reviewsList)}
    
@views.route('/getSummary', methods=['POST'])
def getSummary():
    if request.method == "POST":
        reviewsAggregate = request.form.get('reviewsAggregate')
        HF_API_URL = "https://api-inference.huggingface.co/models/abhiramd22/t5-base-finetuned-to-summarize-movie-reviews"
        if(os.environ.get('HF_API_URL')!=None):
            HF_API_URL=os.environ.get('HF_API_URL')
        headers = {"Authorization": os.environ.get('hf_token')}
        def query(payload):
            response = requests.post(HF_API_URL, headers=headers, json=payload)
            return response.json()
        output = query({ "inputs": 'summarize: '+reviewsAggregate })
        return output