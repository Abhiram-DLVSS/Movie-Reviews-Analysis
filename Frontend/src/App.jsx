import { useState } from "react";
import "./css/style.css";
import Summarization from './Summarization.jsx'
import SentimentAnalysis from './SentimentAnalysis.jsx'
import Input from './Input.jsx'

function App() {
  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid" style={{justifyContent: "center"}}>
          <span className="navbar-brand mb-0 h1">Movie Reviews Analysis</span>
        </div>
      </nav>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        {/*Input*/}
        <Input />
        {/*Summary*/}
        <Summarization />
        {/*Sentiment Analysis*/}
        <SentimentAnalysis />
      </div>
    </>
  );
}

export default App;
