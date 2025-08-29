import { useState } from "react";
import "./css/style.css";

function SentimentAnalysis({ sentimentAnalysisList, reviewsList }) {
    return (
        <>
            <div className="box" id="reviews-parent-div">
                <p style={{ fontWeight: "bold" }}>
                    <a id="movieurl" href="">
                        Reviews
                    </a>{" "}
                    Sentiment Analysis
                </p>
                <div className="divider"></div>
                <div className="grid" id="reviews-boxes-div">
                    {sentimentAnalysisList.map((review, i) => {

                        const label = review?.label;
                        const score = review?.score;
                        const boxClassNamePrefix =
                            label === "POSITIVE" ? "pos" : "neg";

                        return (
                            <div
                                key={i}
                                className={`${boxClassNamePrefix}-review`}
                                title={`Confidence: ${
                                    Math.round(score * 10000) / 100
                                }%`}
                            >
                                {reviewsList[i]}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default SentimentAnalysis;
