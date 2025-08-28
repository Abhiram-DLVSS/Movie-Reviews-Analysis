import { useState } from "react";
import "./css/style.css";

function SentimentAnalysis() {
  return (
    <>
      <div className="box" id="reviews-parent-div">
          <p style={{fontWeight: "bold"}}>
            <a id="movieurl" href="">
              Reviews
            </a>{" "}
            Sentiment Analysis
          </p>
          <div className="divider"></div>
          <div className="grid" id="reviews-boxes-div"></div>
        </div>
    </>
  );
}

export default SentimentAnalysis;
