import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from "react";
import CardHome from "./components/CardHome";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [catsList, setCats] = useState([]);
  const [numCat, setNumCat] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [level, setLevel] = useState("Easy");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [categoryID, setCategoryID] = useState('');
  const [isAdmin, setAdmin] = useState(false);
  const [catsErr, setCatsErr] = useState({
    error: false,
    message: "",
  });

  const navigate = useNavigate();

  const handleShow = (id) => {
    setShowModal(true)
    setCategoryID(id)
  };
  const handleClose = () => setShowModal(false);
  const handleAdmin = () => {
    alert("You are Admin");
  };

  const handleSubmit = () => {
    const queryParams = new URLSearchParams({
      categoryID: categoryID,
      level: level,
      questionNumber: questionNumber
    }).toString();

    navigate(`/quiz?${queryParams}`);
  };

  useEffect(() => {
    fetch("http://localhost:8080/categoryList")
      .then((res) => res.json())
      .then((data) => {
        setCats(data);
      })
      .catch((err) =>
        setCatsErr({
          error: true,
          message: err.message,
        })
      );
  }, [numCat]);

  useEffect(() => {
    fetch("http://localhost:8080/admin-check", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setAdmin(data.admin === 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const increment = () => {
    setNumCat(numCat + 3);
  };

  const limitedCatsList = catsList.slice(0, numCat);

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>
        FUN AND ENGAGING QUIZZES TO TEST YOUR KNOWLEDGE!
      </h1>
      <p style={heading2Style}>Select a Category to Brainstorm</p>
      {catsErr.error && <p style={{ color: "red" }}>{catsErr.message}</p>}
      <div style={cardContainerStyle}>
        {limitedCatsList.map((cat) => (
          <CardHome
            key={cat._id}
            cat={cat}
            action={isAdmin ? handleAdmin : ()=>{handleShow(cat._id)}}
          />
        ))}
      </div>
      {numCat < catsList.length && (
        <button style={buttonStyle} onClick={increment}>
          More Quizzes
        </button>
      )}

      <>
      {showModal && ( <div style={modalStyles}>
          <div style={modalContentStyles}>
            <span
              style={closeBtnStyles}
              onMouseOver={(e) =>
                (e.target.style.color = closeBtnHoverStyles.color)
              }
              onMouseOut={(e) => (e.target.style.color = closeBtnStyles.color)}
              onClick={handleClose}
            >
              &times;
            </span>
            <h2>Select Quiz Level and Question Number</h2>
            <label htmlFor="level">Select Level:</label>
            <select
            style={inputStyle}
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <br />
            <br />
            <label htmlFor="questionNumber">Question Number:</label>
            <select
            style={inputStyle}
              id="questionNumber"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(e.target.value)}
            >
              <option>Select Number of Questions</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
            <br />
            <br />
            <button style={buttonStyle} onClick={handleSubmit}>Go to Quiz</button>
          </div>
        </div>)}
      </>
    </div>
  );
};

// styles
const pageStyle = {
  textAlign: "center",
  backgroundColor: "#f4f4f4",
  padding: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const headingStyle = {
  fontSize: "24px",
  marginBottom: "10px",
};
const inputStyle = {
  margin: "10px 0",
  width: "300px",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const heading2Style = {
  fontSize: "20px",
  marginBottom: "20px",
};

const cardContainerStyle = {
  width: "90%",
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const buttonStyle = {
  backgroundColor: "#282c34",
  color: "#fff",
  padding: "10px 20px",
  fontSize: "18px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const modalStyles = {
  position: "fixed",
  zIndex: 1,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  overflow: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
};

const modalContentStyles = {
  backgroundColor: "#fff",
  margin: "15% auto",
  padding: "20px",
  border: "1px solid #888",
  width: "80%",
};

const closeBtnStyles = {
  color: "#aaa",
  float: "right",
  fontSize: "28px",
  fontWeight: "bold",
  cursor: "pointer",
};

const closeBtnHoverStyles = {
  color: "black",
  textDecoration: "none",
};

export default Home;
