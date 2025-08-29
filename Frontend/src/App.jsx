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
    const [summarizationLoading, setSummarizationLoading] = useState(false);

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
                    movieUrl={movieUrl}
                    setMovieUrl={setMovieUrl}
                    searchMessage={searchMessage}
                    setSearchMessage={setSearchMessage}
                    fetchingReviews={fetchingReviews}
                    setFetchingReviews={setFetchingReviews}
                    summarizationLoading={summarizationLoading}
                    setSummarizationLoading={setSummarizationLoading}
                />
                {submit && (
                    <>
                        <Summarization
                            searchMessage={searchMessage}
                            movieUrl={movieUrl}
                            fetchingReviews={fetchingReviews}
                            summarizationLoading={summarizationLoading}
                            summarizationMessage={summarizationMessage}
                        />

                        {sentimentAnalysisList.length > 0 && (
                            <SentimentAnalysis
                                sentimentAnalysisList={sentimentAnalysisList}
                                reviewsList={reviewsList}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default App;
