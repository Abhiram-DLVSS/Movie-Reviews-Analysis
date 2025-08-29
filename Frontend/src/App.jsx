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
    const [searchMessage, setSearchMessage] = useState("");
    const [movieUrl, setMovieUrl] = useState("");
    const [fetchingReviews, setFetchingReviews] = useState(false);
    const [analyzingReviews, setAnalyzingReviews] = useState(false);
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
                    setSubmit={setSubmit}
                    setSummarizationMessage={setSummarizationMessage}
                    setSentimentAnalysisList={setSentimentAnalysisList}
                    reviewsList={reviewsList}
                    setReviewsList={setReviewsList}
                    movieUrl={movieUrl}
                    setMovieUrl={setMovieUrl}
                    setSearchMessage={setSearchMessage}
                    setFetchingReviews={setFetchingReviews}
                    setAnalyzingReviews={setAnalyzingReviews}
                />
                {submit && (
                    <>
                        <Summarization
                            searchMessage={searchMessage}
                            movieUrl={movieUrl}
                            fetchingReviews={fetchingReviews}
                            analyzingReviews={analyzingReviews}
                            summarizationMessage={summarizationMessage}
                            loading={loading}
                        />

                        {sentimentAnalysisList.length > 0 && (
                            <SentimentAnalysis
                                sentimentAnalysisList={sentimentAnalysisList}
                                reviewsList={reviewsList}
                                movieUrl={movieUrl}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default App;
