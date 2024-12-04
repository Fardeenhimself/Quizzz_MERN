import { useEffect, useState } from "react";

function Scores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("http://localhost:8080/emailBysession", {
          method: "GET",
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user ID');
        }

        const data = await response.json();
        if (data.userId) {
          fetchScores(data.userId);

        } else {
          setError('User not logged in');
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        setError('Error fetching user ID');
        setLoading(false);
      }
    };

    const fetchScores = async (userId) => {
 
      try {
        const response = await fetch(`http://localhost:8080/scores/${userId}`, {
          method: "GET",
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error('Failed to fetch scores');
        }

        const data = await response.json();
        setScores(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching scores:", error);
        setError('Error fetching scores');
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={scoreboardContainer}>
    <h1>Scoreboard</h1>
    <table style={scoreboardTable}>
      <thead>
        <tr style={tableRow}>
          <th style={tableHeader}>Category</th>
          <th style={tableHeader}>Total Quizzes</th>
          <th style={tableHeader}>Correct</th>
          <th style={tableHeader}>Incorrect</th>
          <th style={tableHeader}>Skip</th>
          <th style={tableHeader}>Score</th>
          <th style={tableHeader}>Accuracy</th>
          <th style={tableHeader}>Date</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((score) => (
          <tr key={score._id} style={tableRow}>
            <td style={tableCell}>{score.categoryName}</td>
            <td style={tableCell}>{score.questionsTotal}</td>
            <td style={tableCell}>{score.correctAnswers}</td>
            <td style={tableCell}>{score.incorrectAnswers}</td>
            <td style={tableCell}>{score.skippedAnswers}</td>
            <td style={tableCell}>{score.score}</td>
            <td style={tableCell}>{(score.score / score.questionsTotal) * 100 } %</td>
            <td style={tableCell}>{score.formattedDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}

const scoreboardContainer = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  width: "900px",
  margin: "40px auto",
  padding: "20px",
  textAlign: "center",
  fontFamily: "'Arial, sans-serif'",
};

const scoreboardTable = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const tableRow = {
  borderBottom: "1px solid #ddd",
};

const tableHeader = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px",
  textAlign: "left",
};

const tableCell = {
  padding: "10px",
  textAlign: "left",
};

export default Scores;
