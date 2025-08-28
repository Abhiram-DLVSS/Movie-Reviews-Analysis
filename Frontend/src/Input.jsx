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
    setReviewsList
}) {
    const [movieName, setMovieName] = useState("");
    const [movieUrl, setMovieUrl] = useState("");
    const [reviewsAggregate, setReviewsAggregate] = useState("");
    const [numOfReviews, setNumOfReviews] = useState(0);

    useEffect(() => {
        //Fetch Movie URL
        if (loading === true) {
            fetch(`http://localhost:8080/getMovieURL?movieName=${movieName}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.error == "") setMovieUrl(data.movieUrl);
                    else alert("Error:", data.error);
                })
                .catch((error) => alert("Error:", error));
        }
    }, [loading]);

    useEffect(() => {
        //Fetch Movie Reviews
        if (movieUrl == "") return;
        console.log("Movie URL:", movieUrl);
        if (movieUrl == "https://www.rottentomatoes.com/") {
            setSummarizationMessage("<b>Sorry! Movie not found.</b>");
        }
        fetch(`http://localhost:8080/getReviews?movieUrl=${movieUrl}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.error == "") {
                    setReviewsList(data.reviewsList);
                    setReviewsAggregate(data.reviewsAggregate);
                    setNumOfReviews(data.numOfReviews);
                } else alert("Error at getReviews: " + data.error);
            })
            .catch((error) => alert("Error at getReviews: " + error.message))
            .finally(() => {
                setLoading(false);
            });
    }, [movieUrl]);

    useEffect(() => {
        if (reviewsList.length > 0) {
            const formData = new FormData();
            formData.append("reviewsList", JSON.stringify(reviewsList));

            try {
                fetch("http://localhost:8080/getSentimentAnalysis", {
                    method: "POST",
                    body: formData,
                })
                .then((res) => res.json())
                .then((data) => {
                    setSentimentAnalysisList(data[0]);
                })
                .catch((err) => {
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
        }
    }, [reviewsList]);

    useEffect(() => {
        if (reviewsAggregate != "") {
            const formData = new FormData();
            formData.append("reviewsAggregate", reviewsAggregate);

            try {
                fetch("http://localhost:8080/getSummary", {
                    method: "POST",
                    body: formData,
                })
                .then((res) => res.json())
                .then((data) => {
                    setSummarizationMessage(data[0]['summary_text']);
                })
                .catch((err) => {
                    console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
        }
    }, [reviewsAggregate]);

    const handleSubmit = () => {
        setLoading(true);
        setSubmit(true);
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
