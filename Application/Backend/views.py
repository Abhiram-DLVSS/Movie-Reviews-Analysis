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


@views.route('/getData', methods=['POST', 'GET'])
def checkuser():
    if request.method == "POST":
        movieName=request.form.get('movieName')
        query = "Rotten Tomatoes "+movieName
        movie_url=next(search(query, tld="co.in", num=1, stop=1, pause=2))
        s=Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=s)
        driver.get('{}/reviews'.format(movie_url))
        reviews = driver.find_elements(By.CLASS_NAME, 'review-text')
        reviews_list = 'summarize: '
        if(len(reviews)==0):
            return "Sorry! Movie not found."
        for p in range(len(reviews)):
            reviews_list+=reviews[p].text
            reviews_list+='\n'
        HF_API_URL = "https://api-inference.huggingface.co/models/abhiramd22/t5-base-finetuned-to-summarize-movie-reviews"
        if(os.environ.get('HF_API_URL')!=None):
            HF_API_URL=os.environ.get('HF_API_URL')
        hf_token=os.environ.get('hf_token')
        # hf_token="Bearer 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"
        headers = {"Authorization": hf_token}

        def query(payload):
            response = requests.post(HF_API_URL, headers=headers, json=payload)
            return response.json()

        while (1):
            global output
            output = query({
                "inputs": reviews_list
            })
            if('estimated_time' in output):
                time.sleep(output['estimated_time'])
            else:
                break
        return output[0]['summary_text']
