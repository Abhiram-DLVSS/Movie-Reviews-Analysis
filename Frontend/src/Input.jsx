import { useEffect, useState } from "react";
import "./css/style.css";

function Input({
    loading,
    setLoading,
    setSubmit,
    setSummarizationMessage,
    setSentimentAnalysisList,
    reviewsList,
    setReviewsList,
    movieUrl,
    setMovieUrl,
    setSearchMessage,
    setFetchingReviews,
    setAnalyzingReviews
}) {
    const [movieName, setMovieName] = useState("");
    const [reviewsAggregate, setReviewsAggregate] = useState("");
    const [processed, setProcessed] = useState(0);

    useEffect(() => {
        if (loading === true) {
            setSearchMessage(`Searching for "Rotten Tomatoes ${movieName}"`);
            fetch(`${import.meta.env.VITE_BACKEND_HOST}/getMovieURL?movieName=${movieName}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.movieUrl == "") {
                        setSummarizationMessage("Sorry! Movie not found.");
                        setProcessed(2);
                    } else if (data.error == "") {
                        setMovieUrl(data.movieUrl);
                    } else throw new Error(data.error);
                })
                .catch((error) => {
                    const errorMessage = "Error at getMovieURL: " + error.message;
                    alert(errorMessage);
                    setSummarizationMessage(errorMessage);
                    setProcessed(2);
                });
        } else {
            setSearchMessage("");
            setFetchingReviews(false);
            setAnalyzingReviews(false);
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
        if (movieUrl == "https://www.rottentomatoes.com/") {
            setSummarizationMessage("<b>Sorry! Movie not found.</b>");
            setProcessed(2);
        } else {
            fetch(`${import.meta.env.VITE_BACKEND_HOST}/getReviews?movieUrl=${movieUrl}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.error == "") {
                        if (data.reviewsList.length == 0) {
                            if (movieUrl.includes("/tv/")) {
                                setSummarizationMessage(
                                    `Sorry! Reviews not found.\n
                                    Note: If you provided a TV series as input, please specify a particular season and try again. Example: ${movieName} s1`
                                );
                            } else
                                setSummarizationMessage(
                                    "Sorry! Reviews not found."
                                );

                            setProcessed(2);
                        } else {
                            setReviewsList(data.reviewsList);
                            setReviewsAggregate(data.reviewsAggregate);
                        }
                    } else throw new Error(data.error);
                })
                .catch((error) => {
                    const errorMessage = "Error at getReviews: " + error.message;
                    alert(errorMessage);
                    setSummarizationMessage(errorMessage);
                    setProcessed(2);
                });
        }
    }, [movieUrl]);

    useEffect(() => {
        if (reviewsList.length > 0) {
            try {
                fetch(`${import.meta.env.VITE_BACKEND_HOST}/getSentimentAnalysis`, {
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
                        throw err;
                    })
                    .finally(() => {
                        setProcessed((processed) => processed + 1);
                    });
            } catch (err) {
                {
                    const errorMessage = "Error at getSentimentAnalysis: " + err.message;
                    alert(errorMessage);
                    setSummarizationMessage(errorMessage);
                    setProcessed(2);
                }
            }
        }
    }, [reviewsList]);

    useEffect(() => {
        if (reviewsAggregate != "") {
            try {
                setAnalyzingReviews(true);
                fetch(`${import.meta.env.VITE_BACKEND_HOST}/getSummary`, {
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
                        throw err;
                    })
                    .finally(() => {
                        setProcessed((processed) => processed + 1);
                    });
            } catch (err) {
                {
                    const errorMessage = "Error at getSummary: " + err.message;
                    alert(errorMessage);
                    setSummarizationMessage(errorMessage);
                    setProcessed(2);
                }
            }
        }
    }, [reviewsAggregate]);

    const handleSubmit = () => {
        setMovieUrl("");
        setLoading(true);
        setSubmit(true);
        setProcessed(0);
        setSentimentAnalysisList([]);
        setReviewsAggregate("");
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
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
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
