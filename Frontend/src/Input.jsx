import { useState } from "react";
import "./css/style.css";

function Input() {
  return (
    <>
      
        <div className="box">
          <p style={{fontWeight: "bold"}}>Enter a Movie Name</p>
          <div className=" divider"></div>
          <div
            className="form-group"
            style={{maxWidth: "400px", textAlign: "center", display: "flex", justifyContent: "center"}}
          >
            <label htmlFor="movie_name" className="sr-only">
              Movie Name
            </label>
            <input
              className="form-control"
              id="movie_name"
              name="movie_name"
              style={{textAlign: "center"}}
            />
            
          </div>

          <div>
            <button id="submit" className="btn">
              Go!
            </button>
            <button id="submit-rotate" className="btn" style={{display: "none"}}>
              <span
                className="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
                style={{padding: "10px"}}
              ></span>
              <span className="sr-only">Loading...</span>
            </button>
          </div>
        </div>
        <br />
    </>
  );
}

export default Input;
