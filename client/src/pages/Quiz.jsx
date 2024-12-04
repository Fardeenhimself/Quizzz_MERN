import { useEffect, useState } from "react";
import Question from "./components/Question";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOption] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [noQuiz, setNoQuiz] = useState(false);
  const [timer, setTimer] = useState("00:01");

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const level = queryParams.get('level');
  const questionNumber = queryParams.get('questionNumber');
  const categoryID = queryParams.get('categoryID');

  const navigate = useNavigate();

  const formatTime = (questionCount) => {
    let totalSeconds;
    switch (level) {
      case 'Easy':
        totalSeconds = questionCount * 10;
        break;
      case 'Medium':
        totalSeconds = questionCount * 8;
        break;
      case 'Hard':
        totalSeconds = questionCount * 5;
        break;
      default:
        totalSeconds = questionCount * 10; 
    }
    return totalSeconds < 10 ? `00:0${totalSeconds}` : `00:${totalSeconds}`;
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const confirmFinish = () => {
    setShowModal(true);
  };

  const redirectFun = () => {
    navigate("/");
  };

  const checkResult = () => {
    const correctAnswers = selectedOptions.filter((a) => {
      const question = questions.find((v) => v._id === a.id);
      return question && question.answer === a.answer;
    }).length;

    const incorrectAnswers = selectedOptions.filter((a) => {
      const question = questions.find((v) => v._id === a.id);
      return question && question.answer !== a.answer;
    }).length;

    const skippedAnswers = questions.length - selectedOptions.length;

    navigate("/result", {
      state: {
        questions,
        correctAnswers,
        incorrectAnswers,
        skippedAnswers,
        selectedOptions,

      },
    });
  };

  const answers = (a) => {
    setSelectedOption((prev) => {
      const existingAnswerIndex = prev.findIndex((item) => item.id === a.id);
      if (existingAnswerIndex >= 0) {
        const updatedOptions = [...prev];
        updatedOptions[existingAnswerIndex] = a;
        return updatedOptions;
      } else {
        return [a, ...prev];
      }
    });
  };

  useEffect(() => {
    if (noQuiz) return;

    if (timer === "00:00") {
      checkResult();
      return;
    }

    const timeout = setTimeout(() => {
      const [minutes, seconds] = timer.split(":").map(Number);
      let newMinutes = minutes;
      let newSeconds = seconds - 1;

      if (newSeconds < 0) {
        newMinutes -= 1;
        newSeconds = 59;
      }

      if (newMinutes < 0) {
        setTimer("00:00");
        return;
      }

      setTimer(
        `${newMinutes.toString().padStart(2, "0")}:${newSeconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timer, noQuiz]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const queryParams = new URLSearchParams({
          level: level,
          questionNumber: questionNumber, 
          categoryID: categoryID
        }).toString();

        const response = await fetch(`http://localhost:8080/quiz?${queryParams}`);
        const data = await response.json();
        if (data.length === 0) {
          setNoQuiz(true);
          setQuestions([]);
        } else {
          setQuestions(data);
          setNoQuiz(false);
          setTimer(formatTime(data.length));
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setNoQuiz(true);
        setQuestions([]);
      }
    };

    fetchQuiz();
  }, [level, questionNumber]); 

  if (noQuiz) {
    return (
      <div style={quizContainer}>
        <p>No quiz is available.</p>
        <button onClick={redirectFun} style={buttonCancel}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div style={quizContainer}>
      <div style={quizHeader}>
        <h2 style={headerTitle}></h2>
        <h3 style={headerTitle}>Time: {timer}</h3>
        <p>Total Questions: {questions.length}</p>
      </div>
      <div style={quizContent}>
        {questions.length > 0 && (
          <Question
            key={questions[currentQuestion]._id}
            data={questions[currentQuestion]}
            setter={answers}
            selectedValue={
              selectedOptions.find((val) => val.id === questions[currentQuestion]._id)?.answer || null
            }
          />
        )}
      </div>
      <div style={quizFooter}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          style={button}
        >
          Previous
        </button>
        {currentQuestion === questions.length - 1 ? (
          <button onClick={confirmFinish} style={button}>
            Finish
          </button>
        ) : (
          <button onClick={handleNext} style={button}>
            Next
          </button>
        )}
      </div>
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContainer}>
            <h2>Are you sure you want to finish the quiz?</h2>
            <div style={modalFooter}>
              <button onClick={checkResult} style={button}>
                Yes, Finish
              </button>
              <button onClick={closeModal} style={buttonCancel}>
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const quizContainer = {
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  width: "400px",
  padding: "20px",
  margin: "auto",
  textAlign: "center",
  fontFamily: "Arial, sans-serif",
};

const buttonCancel = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "10px 20px",
  cursor: "pointer",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContainer = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
  textAlign: "center",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const modalFooter = {
  display: "flex",
  justifyContent: "space-around",
  marginTop: "20px",
};

const quizHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const headerTitle = {
  margin: 0,
  color: "#007bff",
};

const quizContent = {
  textAlign: "left",
};

const quizFooter = {
  display: "flex",
  justifyContent: "space-between",
};

const button = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "10px 20px",
  cursor: "pointer",
};

export default Quiz;
