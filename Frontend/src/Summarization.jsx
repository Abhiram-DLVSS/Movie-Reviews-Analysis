import { useState } from "react";

function Summarization({
    searchMessage,
    movieUrl,
    fetchingReviews,
    summarizationLoading,
    summarizationMessage,
}) {
    return (
        <>
            <div className="box" id="result-para">
                <p style={{ fontWeight: "bold" }}>Summary</p>
                <div className="divider"></div>
                <p id="result" style={{ whiteSpace: "pre-line" }}>
                    {summarizationMessage=="" && (
                        <>{searchMessage != "" && searchMessage}
                    {movieUrl != "" && (
                            <>
                            <br/>
                            Movie URL Found: 
                            <a
                                href={`${movieUrl}/reviews?type=top_critics`}
                                target="_blank"
                            >
                                { `${movieUrl}/reviews?type=top_critics`}
                            </a>
                            </>
                    )}
                    {fetchingReviews && (
                        "\nFetching Movie Reviews...\nAnalyzing Movie Reviews..."
                    )}
                    {/* {summarizationLoading && (

                    )} */}</>)}
                    {summarizationMessage != "" && (
                        summarizationMessage
                    )}
                </p>
            </div>
            <br />
        </>
    );
}

export default Summarization;
