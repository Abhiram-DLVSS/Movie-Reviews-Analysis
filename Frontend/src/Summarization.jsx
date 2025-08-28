import { useState } from "react";

function Summarization({ summarizationMessage }) {
    return (
        <>
            <div className="box" id="result-para">
                <p style={{ fontWeight: "bold" }}>Summary</p>
                <div className="divider"></div>
                <p id="result" style={{ whiteSpace: "pre-line" }}>
                    {summarizationMessage}
                </p>
            </div>
            <br />
        </>
    );
}

export default Summarization;
