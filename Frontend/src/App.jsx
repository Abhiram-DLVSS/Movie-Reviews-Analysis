import "./css/style.css";
import Summarization from "./Summarization.jsx";
import SentimentAnalysis from "./SentimentAnalysis.jsx";
import Input from "./Input.jsx";
import { useState } from "react";

function App() {
    const [loading, setLoading] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [summarizationMessage, setSummarizationMessage] = useState("");
    const [sentimentAnalysisList, setSentimentAnalysisList] = useState([]);
    
    const [reviewsList, setReviewsList] = useState([]);
    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <div
                    className="container-fluid"
                    style={{ justifyContent: "center" }}
                >
                    <span className="navbar-brand mb-0 h1">
                        Movie Reviews Analysis
                    </span>
                </div>
            </nav>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Input
                    loading={loading}
                    setLoading={setLoading}
                    submit={submit}
                    setSubmit={setSubmit}
                    summarizationMessage={summarizationMessage}
                    setSummarizationMessage={setSummarizationMessage}
                    sentimentAnalysisList={sentimentAnalysisList}
                    setSentimentAnalysisList={setSentimentAnalysisList}
                    reviewsList={reviewsList}
                    setReviewsList={setReviewsList}
                />
                {submit && (
                    <>
                        <Summarization
                            summarizationMessage={summarizationMessage}
                        />

                        <SentimentAnalysis
                            sentimentAnalysisList={sentimentAnalysisList}
                            reviewsList={reviewsList}
                        />
                    </>
                )}
            </div>
        </>
    );
}

export default App;
