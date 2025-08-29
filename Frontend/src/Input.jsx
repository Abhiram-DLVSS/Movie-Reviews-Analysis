import { useEffect, useState } from "react";
import "./css/style.css";

function Input({
    loading,
    setLoading,
    submit,
    setSubmit,
    summarizationMessage,
    setSummarizationMessage,
    sentimentAnalysisList,
    setSentimentAnalysisList,
    reviewsList,
    setReviewsList,
    movieUrl,
    setMovieUrl,
    searchMessage,
    setSearchMessage,
    fetchingReviews,
    setFetchingReviews,
    summarizationLoading,
    setSummarizationLoading,
}) {
    const [movieName, setMovieName] = useState("");
    const [reviewsAggregate, setReviewsAggregate] = useState("");
    const [processed, setProcessed] = useState(0);

    useEffect(() => {
        //Fetch Movie URL
        if (loading === true) {
            setSearchMessage(`Searching for "Rotten Tomatoes ${movieName}"`);
            fetch(`http://localhost:8080/getMovieURL?movieName=${movieName}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.movieUrl == "") {
                        setSummarizationMessage(
                            "<b>Sorry! Movie not found.</b>"
                        );
                        setProcessed(2);
                    } else if (data.movieUrl == movieUrl) {
                        setProcessed(2);
                    } else if (data.error == "") {
                        setMovieUrl(data.movieUrl);
                    } else alert("Error:", data.error);
                })
                .catch((error) => alert("Error:", error));
        }
    }, [loading]);

    useEffect(() => {
        //Fetch Movie URL
        if (processed === 2) {
            setLoading(false);
        }
    }, [processed]);

    useEffect(() => {
        //Fetch Movie Reviews
        if (movieUrl == "") return;
        setFetchingReviews(true);
        console.log("Movie URL:", movieUrl);
        if (movieUrl == "https://www.rottentomatoes.com/") {
            setSummarizationMessage("<b>Sorry! Movie not found.</b>");
            setProcessed(2);
        } else {
            fetch(`http://localhost:8080/getReviews?movieUrl=${movieUrl}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.error == "") {
                        console.log("Reviews List:", data.reviewsList.length);
                        setReviewsList(data.reviewsList);
                        setReviewsAggregate(data.reviewsAggregate);
                    } else alert("Error at getReviews: " + data.error);
                })
                .catch((error) =>
                    alert("Error at getReviews: " + error.message)
                )
                .finally(() => {
                    setFetchingReviews(false);
                });
        }
    }, [movieUrl]);

    useEffect(() => {
        if (reviewsList.length > 0) {
            try {
                fetch("http://localhost:8080/getSentimentAnalysis", {
                    method: "POST",
                    body: JSON.stringify({ reviewsList: reviewsList }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        setSentimentAnalysisList(data[0]);
                    })
                    .catch((err) => {
                        console.error(err);
                    })
                    .finally(() => {
                        setProcessed((processed) => processed + 1);
                    });
            } catch (err) {
                console.error(err);
            }
        }
    }, [reviewsList]);

    useEffect(() => {
        if (reviewsAggregate != "") {
            try {
                fetch("http://localhost:8080/getSummary", {
                    method: "POST",
                    body: JSON.stringify({
                        reviewsAggregate: reviewsAggregate,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        setSummarizationMessage(data[0]["summary_text"]);
                    })
                    .catch((err) => {
                        console.error(err);
                    })
                    .finally(() => {
                        setProcessed((processed) => processed + 1);
                    });
            } catch (err) {
                console.error(err);
            }
        }
    }, [reviewsAggregate]);

    const handleSubmit = () => {
        setSummarizationMessage("");
        setSentimentAnalysisList([]);
        setLoading(true);
        setSubmit(true);
        setProcessed(0);
    };
    const handleKeyDown = (event) => {
        console.log(event.key);
        if (event.key === "Enter") {
            handleSubmit();
        }
    };
    return (
        <>
            <div className="box">
                <p style={{ fontWeight: "bold" }}>Enter a Movie Name</p>
                <div className=" divider"></div>
                <div
                    className="form-group"
                    style={{
                        maxWidth: "400px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <label htmlFor="movie_name" className="sr-only">
                            Movie Name
                        </label>
                        <input
                            className="form-control"
                            id="movie_name"
                            name="movie_name"
                            style={{ textAlign: "center" }}
                            onChange={(e) => setMovieName(e.target.value)}
                        />
                    </form>
                </div>

                <div>
                    {!loading ? (
                        <button
                            className="btn"
                            onClick={() => {
                                handleSubmit();
                            }}
                            onKeyDown={handleKeyDown}
                        >
                            Go!
                        </button>
                    ) : (
                        <button className="btn">
                            <span
                                className="spinner-grow spinner-grow-sm"
                                role="status"
                                aria-hidden="true"
                                style={{ padding: "10px" }}
                            ></span>
                            <span className="sr-only">Loading...</span>
                        </button>
                    )}
                </div>
            </div>
            <br />
        </>
    );
}

export default Input;
