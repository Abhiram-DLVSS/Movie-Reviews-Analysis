function Summarization({
    searchMessage,
    movieUrl,
    fetchingReviews,
    analyzingReviews,
    summarizationMessage,
    loading,
}) {
    return (
        <>
            <div className="box" id="result-para">
                <p style={{ fontWeight: "bold" }}>Summary</p>
                <div className="divider"></div>
                <p id="result" style={{ whiteSpace: "pre-line" }}>
                    {searchMessage != "" && searchMessage}
                    {movieUrl != "" && loading && (
                        <>
                            <br />
                            {"Movie URL Found: "}
                            <a
                                href={`${movieUrl}/reviews?type=top_critics`}
                                target="_blank"
                            >
                                {`${movieUrl}/reviews?type=top_critics`}
                            </a>
                        </>
                    )}
                    {fetchingReviews && "\nFetching Movie Reviews..."}
                    {analyzingReviews && "\nAnalyzing Movie Reviews..."}

                    {!loading && summarizationMessage}
                </p>
            </div>
            <br />
        </>
    );
}

export default Summarization;
