import { useLocation, useNavigate } from "react-router-dom";
import {  useState } from "react";

function Result() {
  const location = useLocation();
  const { questions, correctAnswers, incorrectAnswers, skippedAnswers } = location.state;
  const navigate = useNavigate();
  
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const getUserId = async () => {
    const response = await fetch("http://localhost:8080/emailBysession", {
      method: "GET",
      credentials: "include",
    }); 
    const data = await response.json();
    return data.userId;
  };

  const postResult = async (userId) => {
    const categoryId = questions[0].categoryId;
    const payload = {
      userId,
      questionsTotal: questions.length,
      correctAnswers,
      incorrectAnswers,
      skippedAnswers,
      categoryId,
      score: correctAnswers
    };

    try {
      const response = await fetch("http://localhost:8080/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Result successfully posted!");
        setIsSubmitted(true); 
      } else {
        console.error("Error posting result");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };



const submitResult = async () => {
      if (!isSubmitted) { 
        const userId = await getUserId(); 
        if (userId) {
          postResult(userId); 
          navigate("/dashboard")
        } else {
          console.error("User not authenticated");
        }
      }
    }

  const resultContainerStyle = {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "500px",
    margin: "40px auto",
    padding: "30px",
    textAlign: "center",
    fontFamily: "'Arial, sans-serif'",
  };

  const headingStyle = {
    color: "#007bff",
    marginBottom: "20px",
    fontSize: "24px",
  };

  const paragraphStyle = {
    color: "#333",
    fontSize: "18px",
    lineHeight: "1.6",
    marginBottom: "20px",
  };

  const selectedOptionsStyle = {
    backgroundColor: "#f1f3f5",
    border: "1px solid #dee2e6",
    padding: "10px",
    borderRadius: "4px",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "14px",
    textAlign: "left",
    wordBreak: "break-word",
  };

  const buttonStyle = {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div style={resultContainerStyle}>
      <h2 style={headingStyle}>Quiz Result</h2>
      <p style={paragraphStyle}>Total Questions: {questions.length}</p>
      <p style={selectedOptionsStyle}>Correct Answer: {correctAnswers}</p>
      <p style={selectedOptionsStyle}>Incorrect Answer: {incorrectAnswers}</p>
      <p style={selectedOptionsStyle}>Skipped Questions: {skippedAnswers}</p>
      <p style={selectedOptionsStyle}>Score: {correctAnswers}</p>
      <button style={buttonStyle} onClick={submitResult}>
        Finish
      </button>
    </div>
  );
}

export default Result;
