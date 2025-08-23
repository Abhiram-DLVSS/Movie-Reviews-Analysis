from flask import Blueprint,render_template,request, jsonify
from googlesearch import search
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import requests
import os
import time
import yaml
views = Blueprint('views',__name__)



HF_SUMM_MODEL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn"
if(os.environ.get('HF_SUMM_MODEL')!=None):
    HF_SUMM_MODEL=os.environ.get('HF_SUMM_MODEL')

HF_SA_MODEL = "https://router.huggingface.co/hf-inference/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english"
if(os.environ.get('HF_SA_MODEL')!=None):
    HF_SA_MODEL=os.environ.get('HF_SA_MODEL')

@views.route('/')
def welcome():
    return render_template("app.html")

@views.route('/getMovieURL', methods=['POST'])
def getMovieURL():
    if request.method == "POST":
        movieName=request.form.get('movieName')
        query = "Rotten Tomatoes "+movieName
        movieurl=""
        error=""
        try:
            movieurl=next(search(query, num=1, stop=1, pause=2))
        except Exception as e:
            error=str(e)
        return {"movie_url":movieurl, "error":error}

@views.route('/getReviews', methods=['POST'])
def getReviews():
    if request.method == "POST":
        movie_url=request.form.get('movie_url')
        s=None
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument('log-level=3')
        driver=None
        if(os.environ.get("isheroku")!=None):
            s=Service(executable_path=os.environ.get("CHROMEDRIVER_PATH"))
            chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
            driver = webdriver.Chrome(service=s, options =chrome_options)
        else:
            s=Service(ChromeDriverManager().install())
            driver = webdriver.Chrome()
        driver.get('{}/reviews?type=top_critics'.format(movie_url))
        reviews = driver.find_elements(By.CLASS_NAME, 'review-text')
        reviewsList = []
        reviewsAggregate = ''
        for p in range(len(reviews)):
            reviewsList.append(reviews[p].text)
            reviewsAggregate+=reviews[p].text
            reviewsAggregate+='\n'
        reviewsList=sorted(reviewsList,key=lambda x: -1*len(x))

        return {"status":200, "reviewsAggregate":reviewsAggregate, "reviewsList":reviewsList, "numOfReviews":len(reviewsList)}
    
@views.route('/getSummary', methods=['POST'])
def getSummary():
    if request.method == "POST":
        reviewsAggregate = request.form.get('reviewsAggregate')
        headers = {"Authorization": os.environ.get('hf_token')}
        def query(payload):
            response = requests.post(HF_SUMM_MODEL, headers=headers, json=payload)
            return response.json()
        output = query({ "inputs": 'summarize the movie based on the following reviews: '+reviewsAggregate })
        return jsonify(output)

@views.route('/getSentimentAnalysis', methods=['POST'])
def getSentimentAnalysis():
    if request.method == "POST":
        reviewsList = yaml.full_load(request.form.get('reviewsList'))
        headers = {"Authorization": os.environ.get('hf_token')}
        def query(payload):
            response = requests.post(HF_SA_MODEL, headers=headers, json=payload)
            return response.json()
        output = query({ "inputs":list(reviewsList) })
        return jsonify(output)
